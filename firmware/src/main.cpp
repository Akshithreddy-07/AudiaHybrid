#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

#ifndef SIMULATION
#define SIMULATION 1
#endif

#if SIMULATION
  const char* WIFI_SSID    = "Wokwi-GUEST";
  const char* WIFI_PASS    = "";
  const int   WIFI_CHANNEL = 6;
  const float ALIVE_LEVEL  = 300.0f;
#else
  #include "secrets.h"
  const char* WIFI_SSID    = SECRET_WIFI_SSID;
  const char* WIFI_PASS    = SECRET_WIFI_PASS;
  const int   WIFI_CHANNEL = 0;
  const float ALIVE_LEVEL  = 40.0f;
#endif

const char* MQTT_HOST       = "broker.hivemq.com";
const int   MQTT_PORT       = 1883;
const char* TOPIC_TELEMETRY = "audiahybrid/cyril-raj/telemetry";
const char* TOPIC_STATUS    = "audiahybrid/cyril-raj/status";
const char* TOPIC_CMD       = "audiahybrid/cyril-raj/cmd";

const int OPT_PIN  = 34;
const int RF_PIN   = 35;
const int MODE_PIN = 14;   // HIGH = prefer optical, LOW = prefer RF
const int LED_OPT  = 25;
const int LED_RF   = 26;
const int LED_OK   = 27;

const unsigned long SAMPLE_MS = 500;

WiFiClient   wifiClient;
PubSubClient mqtt(wifiClient);
LiquidCrystal_I2C lcd(0x27, 16, 2);
unsigned long lastSample = 0, lastMqttTry = 0, lastWifiTry = 0;
unsigned long lcdHoldUntil = 0;

bool gOptOk = false, gRfOk = false, gPreferOptical = true;
uint32_t optPktTx = 0, optPktOk = 0, rfPktTx = 0, rfPktOk = 0;

float rmsLevel(int pin) {
  static int s[800];
  double mean = 0, acc = 0;
  for (int i = 0; i < 800; i++) {
    s[i] = analogRead(pin);
    mean += s[i];
    delayMicroseconds(100);
  }
  mean /= 800.0;
  for (int i = 0; i < 800; i++) {
    acc += (s[i] - mean) * (s[i] - mean);
  }
  return sqrt(acc / 800.0);
}

float readLevel(int pin) {
#if SIMULATION
  float raw = (float)analogRead(pin);
  float jitter = 1.0f + ((int)random(-30, 31)) / 1000.0f;
  float v = raw * jitter;
  if (v < 0) v = 0;
  if (v > 4095) v = 4095;
  return v;
#else
  return rmsLevel(pin);
#endif
}

const char* chooseActive(bool preferOptical, bool optOk, bool rfOk) {
  if (preferOptical) {
    if (optOk) return "optical";
    if (rfOk)  return "rf";
  } else {
    if (rfOk)  return "rf";
    if (optOk) return "optical";
  }
  return "none";
}

// ---------- LCD helpers ----------

void lcdLine(uint8_t row, const String& s) {
  String t = s;
  while (t.length() < 16) t += ' ';
  lcd.setCursor(0, row);
  lcd.print(t.substring(0, 16));
}

// Types the message on the LCD one character at a time and flashes the
// LEDs of the links that are up, so the transmission is visible.
void showTransmit(const String& msg) {
  lcdLine(0, "TX:");
  lcdLine(1, "Sending...");
  for (size_t i = 0; i < msg.length(); i++) {
    if (i < 13) {
      lcd.setCursor(3 + i, 0);
      lcd.print(msg[i]);
    }
    digitalWrite(LED_OPT, gOptOk);
    digitalWrite(LED_RF, gRfOk);
    delay(60);
    digitalWrite(LED_OPT, LOW);
    digitalWrite(LED_RF, LOW);
    delay(40);
  }
  digitalWrite(LED_OPT, gOptOk);
  digitalWrite(LED_RF, gRfOk);
}

// ---------- text link simulation ----------

uint8_t crc8(const uint8_t* d, size_t n) {
  uint8_t c = 0;
  while (n--) {
    c ^= *d++;
    for (int i = 0; i < 8; i++) c = (c & 0x80) ? (uint8_t)((c << 1) ^ 0x07) : (uint8_t)(c << 1);
  }
  return c;
}

bool simulateLink(const String& msg, bool linkUp) {
  uint8_t buf[33];
  size_t n = msg.length();
  if (n == 0 || n > 32) return false;
  memcpy(buf, msg.c_str(), n);
  uint8_t sentCrc = crc8(buf, n);
  if (!linkUp) buf[random((long)n)] ^= (uint8_t)(1 << random(8));
  return crc8(buf, n) == sentCrc;
}

void onCmd(char* topic, byte* payload, unsigned int len) {
  JsonDocument in;
  if (deserializeJson(in, (const char*)payload, len)) return;
  long id = in["id"] | -1L;
  String msg = in["msg"] | "";
  if (id < 0 || msg.length() == 0 || msg.length() > 32) return;

  showTransmit(msg);                       // visible transmission

  bool o = simulateLink(msg, gOptOk);
  bool r = simulateLink(msg, gRfOk);
  optPktTx++; rfPktTx++;
  if (o) optPktOk++;
  if (r) rfPktOk++;

  const char* act = chooseActive(gPreferOptical, o, r);
  const char* link = strcmp(act, "optical") == 0 ? "OPTICAL"
                   : strcmp(act, "rf") == 0      ? "RF" : "NONE";

  lcdLine(1, strcmp(link, "NONE") == 0 ? String("RX: FAILED") : "RX: " + String(link));
  lcdHoldUntil = millis() + 4000;          // keep the result on screen for 4 s

  JsonDocument out;
  out["id"]    = id;
  out["msg"]   = msg;
  out["link"]  = link;
  out["optTx"] = optPktTx;
  out["optOk"] = optPktOk;
  out["rfTx"]  = rfPktTx;
  out["rfOk"]  = rfPktOk;

  char json[256];
  serializeJson(out, json, sizeof(json));
  bool sent = mqtt.publish(TOPIC_TELEMETRY, json);
  Serial.printf("[text] %s -> %s\n", json, sent ? "published" : "not sent");
}

// ---------- connectivity ----------

void connectWifi() {
  Serial.printf("Connecting to Wi-Fi '%s'", WIFI_SSID);
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS, WIFI_CHANNEL);
  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - start < 15000) {
    delay(300);
    Serial.print(".");
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.print("\nConnected, IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("\nWi-Fi not connected yet (will retry)");
  }
}

void ensureMqtt() {
  if (mqtt.connected() || millis() - lastMqttTry < 3000) return;
  lastMqttTry = millis();
  String id = "audia-esp-" + String((uint32_t)random(0xFFFFFF), HEX);
  Serial.print("Connecting to MQTT... ");
  if (mqtt.connect(id.c_str(), nullptr, nullptr, TOPIC_STATUS, 0, true, "offline")) {
    Serial.println("connected");
    mqtt.publish(TOPIC_STATUS, "online", true);
    mqtt.subscribe(TOPIC_CMD);
  } else {
    Serial.printf("failed, rc=%d\n", mqtt.state());
  }
}

void setup() {
  Serial.begin(115200);
  delay(300);
  Serial.println("\nAudiaHybrid firmware starting");

  pinMode(MODE_PIN, INPUT_PULLUP);
  pinMode(LED_OPT, OUTPUT);
  pinMode(LED_RF, OUTPUT);
  pinMode(LED_OK, OUTPUT);

  Wire.begin(21, 22);
  lcd.init();
  lcd.backlight();
  lcdLine(0, "AudiaHybrid");
  lcdLine(1, "Starting...");

  analogReadResolution(12);
  analogSetPinAttenuation(OPT_PIN, ADC_11db);
  analogSetPinAttenuation(RF_PIN, ADC_11db);

  connectWifi();
  mqtt.setServer(MQTT_HOST, MQTT_PORT);
  mqtt.setBufferSize(512);
  mqtt.setCallback(onCmd);
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    if (millis() - lastWifiTry > 5000) {
      lastWifiTry = millis();
      WiFi.reconnect();
    }
  } else {
    ensureMqtt();
    mqtt.loop();
  }

  if (millis() - lastSample < SAMPLE_MS) return;
  lastSample = millis();

  float optical = readLevel(OPT_PIN);
  float rf      = readLevel(RF_PIN);
  bool optOk = optical > ALIVE_LEVEL;
  bool rfOk  = rf > ALIVE_LEVEL;
  bool preferOptical = digitalRead(MODE_PIN) == HIGH;
  const char* active = chooseActive(preferOptical, optOk, rfOk);

  gOptOk = optOk; gRfOk = rfOk; gPreferOptical = preferOptical;

  digitalWrite(LED_OPT, optOk);
  digitalWrite(LED_RF, rfOk);
  digitalWrite(LED_OK, strcmp(active, "none") != 0);

  // Idle LCD status (skipped while a message result is being shown)
  if (millis() >= lcdHoldUntil) {
    char l0[17], l1[17];
    snprintf(l0, sizeof(l0), "OPT:%-3s RF:%-3s  ", optOk ? "OK" : "--", rfOk ? "OK" : "--");
    snprintf(l1, sizeof(l1), "Link:%-11s", active);
    lcd.setCursor(0, 0); lcd.print(l0);
    lcd.setCursor(0, 1); lcd.print(l1);
  }

  JsonDocument doc;
  doc["optical"]   = (int)optical;
  doc["rf"]        = (int)rf;
  doc["opt_ok"]    = optOk;
  doc["rf_ok"]     = rfOk;
  doc["preferred"] = preferOptical ? "optical" : "rf";
  doc["active"]    = active;
  doc["rssi"]      = (WiFi.status() == WL_CONNECTED) ? WiFi.RSSI() : 0;

  char payload[200];
  serializeJson(doc, payload, sizeof(payload));
  bool sent = mqtt.connected() && mqtt.publish(TOPIC_TELEMETRY, payload);
  Serial.printf("%s -> %s\n", payload, sent ? "published" : "not sent");
}