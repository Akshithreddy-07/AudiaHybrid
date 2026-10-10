// AudiaHybrid firmware v1: Manchester text link over LIGHT (LED -> phototransistor) and RF (433 MHz)
// Board: ESP32 Dev Module. Library needed: LiquidCrystal (built in to the Library Manager).
//
// Frame (both links): preamble (0xAA bytes) | sync 0x2D 0xD4 | len | text | CRC8
// Receiver accepts whichever link decodes with a valid CRC, shows text + source on the LCD, beeps.
// If the same text arrives on both links within 4 s it is shown once as "RF+LIGHT" (one beep).
//
// Serial commands (115200, newline):
//   hello        send on BOTH links
//   l:hello      send on LIGHT only   (guide test 5)
//   r:hello      send on RF only      (guide test 6)
//   step         measure how fast the light sensor follows the LED (rise/fall time)
//   auto         toggle the automatic HELLO every 8 s
//   dbg          toggle pulse dumps on failed receives
//   lrx / rfrx   toggle light polling / RF receiver interrupt (fault finding)
//   cal          recalibrate the light threshold (LED on/off averages, like guide stage 3)
//   Cover the LED/tube while sending on both: source should become RF only (guide test 7).

#include <LiquidCrystal.h>

#define AUTO_HELLO 0     // 1 = send HELLO on both links every 8 s (bring-up). 0 = only send what you type.
#define USE_MQTT   0     // 1 = report received messages to MQTT (fill in the settings below).
                         // Keep 0 until tests 5-7 pass: WiFi can disturb the RF bit timing.

// ---------- pins (guide section 2) ----------
const int LIGHT_TX = 25;
const int LIGHT_RX = 34;
const int RF_TX    = 26;
const int RF_RX    = 35;
const int BUZZER   = 21;   // speaker amp input (via 10k + 22 nF filter)
LiquidCrystal lcd(19, 18, 17, 16, 4, 23);   // RS, E, D4, D5, D6, D7

// ---------- common ----------
const int MAXLEN = 16;
const uint16_t SYNC = 0x2DD4;

// RF timing (proven in test v7)
const int RF_T_US = 800;          // half-bit, 250 bps (400 us was too fast for this receiver in a noisy room)
const int RF_GLITCH_US = RF_T_US * 3 / 8;   // pulses shorter than this are noise and get merged away
const int ISR_MERGE_US = 100;
const int RF_PREAMBLE = 16;       // 16 bytes = ~205 ms at 250 bps; receiver needs ~65 ms wake-up + ~20 ms noise
const int RF_REPEATS = 3;         // each RF message is sent this many times (noisy rooms lose frames)
const int RF_PREAMBLE_REPEAT = 8;   // shorter preamble for the repeats (receiver is already awake)

// Light timing. Measured with 'step': this sensor has a ~2.5 ms time constant (10k load), so
// 200 bps (2500 us) is far too fast. 6000 us half-bit = ~83 bps. If CRC errors remain, try 8000.
// To go faster later: use a smaller load resistor (4.7k or 2.2k) on GPIO34, then re-run 'step'.
const int LT_T_US = 6000;
const int LT_PREAMBLE = 4;

uint8_t crc8(const uint8_t* d, int n) {
  uint8_t c = 0;
  for (int i = 0; i < n; i++) {
    c ^= d[i];
    for (int b = 0; b < 8; b++) c = (c & 0x80) ? (c << 1) ^ 0x07 : (c << 1);
  }
  return c;
}

// ---------- Manchester decoder (one instance per link) ----------
struct Dec {
  uint32_t hs = 0, syncCount = 0, nBadPair = 0, nBadLen = 0, nCrc = 0;
  bool synced = false, inv = false, gotMsg = false, crcFail = false;
  uint8_t phase = 0, bitIdx = 0, byteIdx = 0, need = 0, cur = 0;
  uint8_t rbuf[MAXLEN + 2];
  char msg[MAXLEN + 1];

  void drop() { synced = false; hs = 0; }

  // 0 = none, 1 = normal polarity, 2 = inverted polarity
  int syncMatch() {
    uint16_t w = 0;
    for (int i = 0; i < 16; i++) {
      uint8_t pair = (hs >> (2 * (15 - i))) & 3;
      if (pair == 1) w = (w << 1) | 1;
      else if (pair == 2) w = w << 1;
      else return 0;
    }
    if (w == SYNC) return 1;
    if (w == (uint16_t)~SYNC) return 2;
    return 0;
  }

  void push(uint8_t lvl) {
    hs = (hs << 1) | lvl;
    if (!synced) {
      int m = syncMatch();
      if (m) {
        synced = true; inv = (m == 2); syncCount++;
        phase = 0; bitIdx = 0; byteIdx = 0; cur = 0;
      }
      return;
    }
    if (++phase < 2) return;
    phase = 0;
    uint8_t pair = hs & 3, bit;
    if (pair == 1) bit = 1;
    else if (pair == 2) bit = 0;
    else { nBadPair++; drop(); return; }
    if (inv) bit ^= 1;

    cur = (cur << 1) | bit;
    if (++bitIdx == 8) {
      rbuf[byteIdx++] = cur; bitIdx = 0; cur = 0;
      if (byteIdx == 1) {
        if (rbuf[0] == 0 || rbuf[0] > MAXLEN) { nBadLen++; drop(); return; }
        need = rbuf[0] + 2;
      } else if (byteIdx == need) {
        if (crc8(rbuf, need - 1) == rbuf[need - 1]) {
          memcpy(msg, rbuf + 1, rbuf[0]);
          msg[rbuf[0]] = 0;
          gotMsg = true;
        } else {
          crcFail = true; nCrc++;
        }
        drop();
      }
    }
  }
};
Dec rfD, ltD;

// debug capture: first 400 pulses seen by each receiver after a transmission starts
struct Cap {
  uint16_t dt[400]; uint8_t lv[400]; int n = 0;
  void add(uint32_t d, uint8_t l) { if (n < 400) { dt[n] = d > 65535 ? 65535 : d; lv[n] = l; n++; } }
  void show(const char* name) {
    Serial.printf("%s pulses (lvl:us): ", name);
    for (int i = 0; i < n; i++) Serial.printf("%u:%u ", lv[i], dt[i]);
    Serial.println();
  }
};
Cap capR, capL;

// runtime switches for fault finding (serial commands: auto, lrx, rfrx)
bool autoHello = (AUTO_HELLO + 0);     // 'auto'  : toggle the HELLO every 5 s
bool lightRxOn = true;           // 'lrx'   : toggle light receiver polling
bool rfRxOn = true;              // 'rfrx'  : toggle the RF receiver interrupt
bool dbg = false;                // 'dbg'   : print pulse dumps when a link fails
volatile uint32_t isrRaw = 0;    // raw RF receiver edges (before merging)

// ---------- transmitter (generic over the link) ----------
const int LINK_RF = 0, LINK_LIGHT = 1;

void pollLight();            // forward declarations: light TX keeps both receivers running
void processEdges();
void waitUs(uint32_t us) {
  uint32_t t0 = micros();
  while ((uint32_t)(micros() - t0) < us) { pollLight(); processEdges(); }
}

void txHalf(int link, int l) {
  if (link == LINK_RF) { digitalWrite(RF_TX, l);    delayMicroseconds(RF_T_US); }
  else                 { digitalWrite(LIGHT_TX, l); waitUs(LT_T_US); }
}

void txBit(int link, int b)      { txHalf(link, !b); txHalf(link, b); }
void txByte(int link, uint8_t v) { for (int i = 7; i >= 0; i--) txBit(link, (v >> i) & 1); }

void txFrame(int link, int preBytes, const char* msg) {
  int n = strlen(msg);
  if (n > MAXLEN) n = MAXLEN;
  uint8_t buf[MAXLEN + 1];
  buf[0] = n;
  memcpy(buf + 1, msg, n);
  uint8_t crc = crc8(buf, n + 1);
  for (int i = 0; i < preBytes; i++) txByte(link, 0xAA);
  txByte(link, 0x2D); txByte(link, 0xD4);
  txByte(link, n);
  for (int i = 0; i < n; i++) txByte(link, msg[i]);
  txByte(link, crc);
  txBit(link, 1); txBit(link, 1);
}

// ---------- RF receiver: ISR edge buffer + decoder (from test v7) ----------
const uint16_t BUF_SIZE = 8192;
const uint16_t MASK = BUF_SIZE - 1;
volatile uint32_t edgeT[BUF_SIZE];
volatile uint16_t head = 0, tail = 0;

void IRAM_ATTR isr() {
  isrRaw++;
  uint32_t now = micros();
  uint16_t h = head;
  if (h != tail && (uint32_t)(now - edgeT[(h - 1) & MASK]) < (uint32_t)ISR_MERGE_US) return;
  uint16_t nh = (h + 1) & MASK;
  if (nh == tail) return;
  edgeT[h] = now;
  head = nh;
}

bool popEdge(uint32_t &t) {
  bool ok = false;
  noInterrupts();
  if (tail != head) { t = edgeT[tail]; tail = (tail + 1) & MASK; ok = true; }
  interrupts();
  return ok;
}

uint32_t rfLastT = 0;
uint8_t rfAcc = 0;
float est[2] = {2.0f * RF_T_US, 2.0f * RF_T_US};   // learned long (2T) pulse length per level
float prevSame[2] = {0, 0};
uint8_t streak = 0;

// classify one clean pulse and feed the Manchester decoder
void emitPulse(uint8_t before, uint32_t dt) {
  if (!rfD.synced) {                     // learn the long-pulse length from the preamble
    bool lookLong = (dt > (uint32_t)(RF_T_US * 11 / 10) && dt < (uint32_t)(RF_T_US * 13 / 4)
                     && fabsf((float)dt - prevSame[before]) < RF_T_US / 2.0f);
    prevSame[before] = dt;
    if (lookLong) { if (streak < 255) streak++; } else streak = 0;
    if (streak >= 8) est[before] = 0.8f * est[before] + 0.2f * dt;
  }
  int n;
  if (dt > est[before] + RF_T_US) n = 0;                    // too long
  else if (dt > est[before] - RF_T_US / 2) n = 2;           // long pulse (2T)
  else n = 1;                                               // short pulse (1T)
  if (n == 0) { rfD.drop(); return; }
  for (int i = 0; i < n; i++) rfD.push(before);
}

// glitch filter: a pulse shorter than RF_GLITCH_US between two pulses of the same level is merged into them
bool mHave = false, gHave = false;
uint8_t mLvl = 0;
uint32_t mDt = 0, gDt = 0;

void feedPulse(uint8_t lvl, uint32_t dt) {
  if (!mHave) { mHave = true; mLvl = lvl; mDt = dt; return; }
  if (gHave) { mDt += gDt + dt; gHave = false; return; }     // glitch + this pulse join the held pulse
  if (dt < (uint32_t)RF_GLITCH_US) { gHave = true; gDt = dt; return; }
  emitPulse(mLvl, mDt);
  mLvl = lvl; mDt = dt;
}

void processEdges() {
  uint32_t t;
  while (popEdge(t)) {
    uint32_t dt = t - rfLastT;
    if (dt > (uint32_t)(RF_T_US * 15 / 2)) {   // long silence: restart
      rfLastT = t; rfAcc ^= 1;
      rfD.drop(); streak = 0; mHave = gHave = false;
      continue;
    }
    uint8_t before = rfAcc;
    rfAcc ^= 1;
    rfLastT = t;
    capR.add(dt, before);
    feedPulse(before, dt);
  }
}

// ---------- light receiver: polled ADC with hysteresis ----------
// Thresholds follow the room: low reference (ltBase) + the signal swing (ltAmp) measured by 'cal'.
int thrHi = 2000, thrLo = 1800, lastV = 0, lastGap = 0;
float ltBase = 0;                // sensor reading with the LED dark (tracks slow ambient changes)
int ltAmp = 1000;                // swing the LED produces within one longest run
bool ltLevel = false;
uint32_t ltLast = 0;

void ltUpdateThr() {
  thrHi = (int)(ltBase + ltAmp * 0.625f);
  thrLo = (int)(ltBase + ltAmp * 0.375f);
}

void pollLight() {
  if (!lightRxOn) return;
  int v = analogRead(LIGHT_RX);
  lastV = v;
  uint32_t now = micros();
  if ((uint32_t)(now - ltLast) > 100000) {          // 100 ms with no edge: idle, re-reference to the room
    ltBase = v; ltLevel = false; ltLast = now; ltD.drop(); ltUpdateThr();
    return;
  }
  if (!ltLevel && v < thrLo) { ltBase += (v - ltBase) * (1.0f / 2048); ltUpdateThr(); }
  bool nl = ltLevel ? (v > thrLo) : (v > thrHi);
  if (nl == ltLevel) return;
  uint32_t dt = now - ltLast;
  bool before = ltLevel;
  ltLevel = nl; ltLast = now;
  capL.add(dt, before);
  if (dt > (uint32_t)(3 * LT_T_US) || dt < (uint32_t)(LT_T_US / 2)) { ltD.drop(); return; }
  int n = (dt < (uint32_t)(LT_T_US * 3 / 2)) ? 1 : (dt < (uint32_t)(LT_T_US * 5 / 2) ? 2 : 0);
  if (!n) { ltD.drop(); return; }
  for (int i = 0; i < n; i++) ltD.push(before);
}

int avgLight() {
  long s = 0;
  for (int i = 0; i < 100; i++) { s += analogRead(LIGHT_RX); delay(2); }
  return s / 100;
}

// Level the sensor reaches after the LED has been on/off for one longest run (2 half-bits),
// which is what it really sees while receiving a frame (not the 300 ms saturated level).
int levelAfterRun(bool on) {
  digitalWrite(LIGHT_TX, on ? LOW : HIGH); delay(300);      // settle at the opposite level
  digitalWrite(LIGHT_TX, on ? HIGH : LOW);
  delay(2 * LT_T_US / 1000);
  long s = 0;
  for (int i = 0; i < 20; i++) { s += analogRead(LIGHT_RX); delayMicroseconds(100); }
  return s / 20;
}

void calibrate() {
  int on = levelAfterRun(true);
  int off = levelAfterRun(false);
  digitalWrite(LIGHT_TX, LOW);
  int gap = on - off, mid = (on + off) / 2;
  lastGap = gap;
  ltBase = off; ltAmp = gap > 50 ? gap : 50;
  ltUpdateThr();
  ltLevel = false;
  ltLast = micros();
  ltD.drop();
  Serial.printf("LIGHT cal: on %d off %d gap %d threshold %d (using %d/%d)\n", on, off, gap, mid, thrLo, thrHi);
  uint32_t t0 = micros(); int cnt = 0;
  while ((uint32_t)(micros() - t0) < 100000) { analogRead(LIGHT_RX); cnt++; }
  Serial.printf("ADC speed: %d samples in 100 ms (%d us each)\n", cnt, cnt ? 100000 / cnt : 0);
  if (gap < 500) Serial.println("LIGHT warning: gap below ~500. Check tube, sensor legs, room light (guide stage 3 fixes).");
}

// ---------- optical step-response test (serial command: step) ----------
// Measures how fast the sensor follows the LED. A 200 bps link needs rise/fall well under ~1 ms.
long crossTime(const uint16_t* v, const uint32_t* t, int n, int level, bool up) {
  for (int i = 0; i < n; i++) if (up ? (v[i] >= level) : (v[i] <= level)) return (long)t[i];
  return -1;
}

void stepTest() {
  static uint16_t sv[500];
  static uint32_t st[500];
  const int N = 500;
  for (int dir = 1; dir >= 0; dir--) {               // dir 1 = LED turns ON, dir 0 = LED turns OFF
    digitalWrite(LIGHT_TX, dir ? LOW : HIGH);
    delay(400);                                      // settle at the opposite level
    uint32_t t0 = micros();
    digitalWrite(LIGHT_TX, dir ? HIGH : LOW);
    for (int i = 0; i < N; i++) { sv[i] = analogRead(LIGHT_RX); st[i] = micros() - t0; }
    digitalWrite(LIGHT_TX, LOW);
    Serial.printf("STEP %s: %d samples in %u us (%u us each), start %d, end %d\n",
                  dir ? "LED ON " : "LED OFF", N, (unsigned)st[N - 1], (unsigned)(st[N - 1] / N), sv[0], sv[N - 1]);
    const int lv[4] = {500, 1536, 2558, 3600};
    Serial.printf("  time (us) to cross 500/1536/2558/3600: ");
    for (int k = 0; k < 4; k++) {
      int L = dir ? lv[k] : lv[3 - k];
      Serial.printf("%ld ", crossTime(sv, st, N, L, dir == 1));
    }
    Serial.println("(-1 = never within the window)");
    Serial.print("  trace (us:adc): ");
    for (int i = 0; i < N; i += 25) Serial.printf("%u:%u ", (unsigned)st[i], sv[i]);
    Serial.println();
  }
  delay(300);
  ltBase = analogRead(LIGHT_RX); ltUpdateThr();
  ltLevel = false; ltLast = micros(); ltD.drop();
}

// ---------- buzzer / LCD ----------
uint32_t beepOff = 0;
void beep(int ms) { ledcWrite(BUZZER, 128); beepOff = millis() + ms; }
void serviceBeep() {
  if (beepOff && (int32_t)(millis() - beepOff) >= 0) { ledcWrite(BUZZER, 0); beepOff = 0; }
}

void lcdShow(const char* text, const char* src) {
  char line[17];
  int n = 0;
  for (; text[n] && n < 16; n++) line[n] = (text[n] >= 32 && text[n] < 127) ? text[n] : '?';
  line[n] = 0;
  lcd.clear();
  lcd.setCursor(0, 0); lcd.print(line);
  lcd.setCursor(0, 1); lcd.print("Via "); lcd.print(src);
}

// ---------- optional MQTT (HiveMQ) ----------
#if (USE_MQTT + 0)
#include <WiFi.h>
#include <PubSubClient.h>
const char* WIFI_SSID = "YOUR_WIFI";
const char* WIFI_PASS = "YOUR_PASSWORD";
const char* MQTT_HOST = "broker.hivemq.com";   // public broker; HiveMQ Cloud needs TLS + login instead
const int   MQTT_PORT = 1883;
const char* MQTT_TOPIC = "audiahybrid/rx";
WiFiClient net;
PubSubClient mqtt(net);
uint32_t mqttTry = 0;

void mqttSetup() { WiFi.mode(WIFI_STA); WiFi.begin(WIFI_SSID, WIFI_PASS); mqtt.setServer(MQTT_HOST, MQTT_PORT); }
void mqttPublish(const char* text, const char* src) {
  if (WiFi.status() != WL_CONNECTED) return;
  if (!mqtt.connected()) {
    if (millis() - mqttTry < 10000) return;      // retry at most every 10 s
    mqttTry = millis();
    mqtt.connect("audiahybrid-esp32");
    if (!mqtt.connected()) return;
  }
  char out[96];
  snprintf(out, sizeof(out), "{\"text\":\"%s\",\"src\":\"%s\"}", text, src);
  mqtt.publish(MQTT_TOPIC, out);
}
void mqttService() { if (mqtt.connected()) mqtt.loop(); }
#else
void mqttSetup() {}
void mqttPublish(const char*, const char*) {}
void mqttService() {}
#endif

// ---------- received message handling ----------
struct LastRx { char text[MAXLEN + 1]; uint32_t t; bool valid; };
LastRx lastBy[2];                         // per link: 0 = RF, 1 = LIGHT
char shownText[MAXLEN + 1] = "";
uint32_t shownT = 0;
uint8_t shownMask = 0;                    // which links delivered the message now on the LCD (bit0 RF, bit1 LIGHT)

void onMessage(int link, const char* text, bool inverted) {
  const char* name = link == 0 ? "RF" : "LIGHT";
  uint32_t now = millis();
  LastRx &me = lastBy[link];
  if (me.valid && strcmp(me.text, text) == 0 && now - me.t < 2500) return;   // repeat of the same frame on this link
  strncpy(me.text, text, MAXLEN); me.text[MAXLEN] = 0; me.t = now; me.valid = true;
  Serial.printf("RX via %s: %s (CRC OK)%s\n", name, text, inverted ? " [inverted polarity]" : "");

  uint8_t bit = 1 << link;
  if (shownMask && strcmp(shownText, text) == 0 && now - shownT < 5000 && !(shownMask & bit)) {
    shownMask |= bit;                     // same message also arrived on the other link: update the source only
    lcdShow(text, "RF+LIGHT");
    return;
  }
  strncpy(shownText, text, MAXLEN); shownText[MAXLEN] = 0;
  shownT = now; shownMask = bit;
  lcdShow(text, name);
  beep(150);
  mqttPublish(text, name);
}

void deliverRx() {
  if (rfD.gotMsg) { rfD.gotMsg = false; onMessage(0, rfD.msg, rfD.inv); }
  if (ltD.gotMsg) { ltD.gotMsg = false; onMessage(1, ltD.msg, ltD.inv); }
}

// ---------- send ----------
uint32_t lastSend = 0;

void sendMessage(const char* msg, bool doRF, bool doLT) {
  lastSend = millis();
  processEdges();
  rfD.drop(); ltD.drop(); streak = 0; capR.n = 0; capL.n = 0; isrRaw = 0;
  rfD.syncCount = rfD.nBadPair = rfD.nBadLen = rfD.nCrc = 0;
  rfD.gotMsg = ltD.gotMsg = rfD.crcFail = ltD.crcFail = false;
  Serial.printf("TX[%s%s%s]: %s\n", doRF ? "RF" : "", (doRF && doLT) ? "+" : "", doLT ? "LIGHT" : "", msg);

  if (doRF) {
    for (int r = 0; r < RF_REPEATS; r++) {
      txFrame(LINK_RF, r ? RF_PREAMBLE_REPEAT : RF_PREAMBLE, msg);
      digitalWrite(RF_TX, LOW);
      uint32_t g = millis();
      while (millis() - g < 30) { processEdges(); pollLight(); }   // gap between repeats, keep draining
    }
  }
  if (doLT) { txFrame(LINK_LIGHT, LT_PREAMBLE, msg); digitalWrite(LIGHT_TX, LOW); }

  uint32_t t0 = millis();
  while (millis() - t0 < 60) { processEdges(); pollLight(); }   // drain the last edges

  bool gotR = rfD.gotMsg, gotL = ltD.gotMsg;
  bool crcR = rfD.crcFail, crcL = ltD.crcFail;
  deliverRx();
  if (doRF && !gotR) {
    Serial.printf("RF: nothing decoded%s\n", crcR ? " (CRC FAIL)" : "");
    if (dbg) {
      Serial.printf("  learned long pulse %.0f/%.0f us, raw edges %u\n", est[0], est[1], (unsigned)isrRaw);
      Serial.printf("  sync words found %u, bad pairs %u, bad length %u, CRC fails %u\n",
                    (unsigned)rfD.syncCount, (unsigned)rfD.nBadPair, (unsigned)rfD.nBadLen, (unsigned)rfD.nCrc);
      capR.show("RF");
    }
  }
  if (doLT && !gotL) {
    Serial.printf("LIGHT: nothing decoded%s\n", crcL ? " (CRC FAIL)" : "");
    if (dbg) {
      Serial.printf("  last ADC %d, thresholds %d/%d, gap %d\n", lastV, thrLo, thrHi, lastGap);
      capL.show("LIGHT");
    }
  }
}

// ---------- serial line input (non-blocking) ----------
char inLine[40];
int inN = 0;
bool readLine() {
  while (Serial.available()) {
    char c = Serial.read();
    if (c == '\r') continue;
    if (c == '\n') { inLine[inN] = 0; inN = 0; return true; }
    if (inN < (int)sizeof(inLine) - 1) inLine[inN++] = c;
  }
  return false;
}

void setup() {
  Serial.begin(115200);
  pinMode(RF_TX, OUTPUT);    digitalWrite(RF_TX, LOW);
  pinMode(LIGHT_TX, OUTPUT); digitalWrite(LIGHT_TX, LOW);
  pinMode(RF_RX, INPUT);
  analogReadResolution(12);
  analogSetPinAttenuation(LIGHT_RX, ADC_11db);
  ledcAttach(BUZZER, 2000, 8); ledcWrite(BUZZER, 0);     // core 3.x API, as in the guide's stage 5 test

  lcd.begin(16, 2);
  lcd.print("AudiaHybrid");
  lcd.setCursor(0, 1); lcd.print("calibrating...");

  attachInterrupt(digitalPinToInterrupt(RF_RX), isr, CHANGE);
  delay(500);
  calibrate();
  mqttSetup();

  lcd.clear(); lcd.print("AudiaHybrid"); lcd.setCursor(0, 1); lcd.print("Waiting...");
  Serial.println("AudiaHybrid ready. 'text' = both links, 'l:text' = light only, 'r:text' = RF only, 'cal' = recalibrate");
}

void loop() {
  processEdges();
  pollLight();
  serviceBeep();
  mqttService();
  deliverRx();

  if (readLine()) {
    char* m = inLine;
    while (*m == ' ') m++;
    if (strcasecmp(m, "cal") == 0) { calibrate(); return; }
    if (strcasecmp(m, "dbg") == 0)  { dbg = !dbg; Serial.printf("debug dumps %s\n", dbg ? "ON" : "OFF"); return; }
    if (strcasecmp(m, "step") == 0) { stepTest(); return; }
    if (strcasecmp(m, "auto") == 0) { autoHello = !autoHello; Serial.printf("auto HELLO %s\n", autoHello ? "ON" : "OFF"); return; }
    if (strcasecmp(m, "lrx") == 0)  { lightRxOn = !lightRxOn; Serial.printf("light polling %s\n", lightRxOn ? "ON" : "OFF"); return; }
    if (strcasecmp(m, "rfrx") == 0) {
      if (rfRxOn) detachInterrupt(digitalPinToInterrupt(RF_RX));
      else { tail = head; attachInterrupt(digitalPinToInterrupt(RF_RX), isr, CHANGE); }
      rfRxOn = !rfRxOn; Serial.printf("RF receiver %s\n", rfRxOn ? "ON" : "OFF"); return;
    }
    bool doRF = true, doLT = true;
    if ((m[0] == 'l' || m[0] == 'L') && m[1] == ':') { doRF = false; m += 2; }
    else if ((m[0] == 'r' || m[0] == 'R') && m[1] == ':') { doLT = false; m += 2; }
    if (*m) sendMessage(m, doRF, doLT);
  }
  else if (autoHello && millis() - lastSend > 8000) sendMessage("HELLO", true, true);
}
