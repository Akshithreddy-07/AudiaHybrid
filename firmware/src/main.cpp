#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

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

const int OPT_PIN  = 34;
const int RF_PIN   = 35;
const int MODE_PIN = 14;   // HIGH = prefer optical, LOW = prefer RF
const int LED_OPT  = 25;
const int LED_RF   = 26;
const int LED_OK   = 27;

const unsigned long SAMPLE_MS = 500;

WiFiClient   wifiClient;
PubSubClient mqtt(wifiClient);
unsigned long lastSample = 0, lastMqttTry = 0, lastWifiTry = 0;

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

  analogReadResolution(12);
  analogSetPinAttenuation(OPT_PIN, ADC_11db);
  analogSetPinAttenuation(RF_PIN, ADC_11db);

  connectWifi();
  mqtt.setServer(MQTT_HOST, MQTT_PORT);
  mqtt.setBufferSize(256);
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

  digitalWrite(LED_OPT, optOk);
  digitalWrite(LED_RF, rfOk);
  digitalWrite(LED_OK, strcmp(active, "none") != 0);

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