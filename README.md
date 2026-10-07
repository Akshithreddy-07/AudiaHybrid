# AudiaHybrid – Hybrid RF–Optical Assistive Listening Platform

[![Phase 1 Status](https://img.shields.io/badge/Phase%201-Complete%20(Theme%20Edition)-4CC9A0)](#)
[![Tech Stack](https://img.shields.io/badge/Stack-React%2018%20%7C%20Vite%20%7C%20Tailwind%20%7C%20Glassmorphism-25196B)](#)
[![Course](https://img.shields.io/badge/Course-25SC2008E%20FSWD-F59E6C)](#)

AudiaHybrid is a live telemetry monitoring and informational web platform for a dual-link hybrid RF (non-line-of-sight) and Optical (interference-free) assistive listening device powered by analog signal processing and ESP32 IoT telemetry.

---

## 🏗 Repository Structure (Monorepo)

```text
audiahybrid/
├── PROJECT_SPEC.md                 # Permanent master specification document
├── README.md                       # Project overview & phase tracking
├── client/                         # React 18 + Vite frontend
│   ├── public/
│   │   └── favicon.svg             # Custom AudiaHybrid sound-to-light SVG icon
│   ├── src/
│   │   ├── components/             # Reusable glassmorphic UI components & LiveHardwarePanel
│   │   │   ├── LiveHardwarePanel.jsx # Real-time ESP32 hardware telemetry monitor
│   │   │   └── ...
│   │   ├── hooks/
│   │   │   ├── useAudiaLive.js     # Direct MQTT WSS telemetry subscriber hook
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx       # Real-time telemetry dashboard & hardware panel
│   │   │   └── ...
│   │   └── ...
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
├── backend/                        # Node.js + Express + Prisma telemetry bridge
│   ├── prisma/
│   │   ├── schema.prisma           # Prisma schema with HardwareReading model
│   │   └── dev.db
│   ├── src/
│   │   ├── services/mqttService.js # MQTT ingestion and rate-limited database storage
│   │   ├── routes/apiRoutes.js     # REST API including /api/hardware/readings
│   │   └── server.js
│   ├── .env.example
│   └── package.json
└── firmware/                       # PlatformIO ESP32 firmware & Wokwi simulation
    ├── diagram.json                # Wokwi simulation schematic (pots, switch, LEDs)
    ├── wokwi.toml                  # Wokwi simulation configuration
    ├── platformio.ini              # PlatformIO build configuration (SIMULATION flag)
    └── src/
        ├── main.cpp                # ESP32 dual simulation / hardware firmware
        ├── secrets.example.h       # Wi-Fi credentials template
        └── secrets.h               # Local Wi-Fi credentials (git-ignored)
```

---

## ⚡ Live Hardware Link & Telemetry Architecture

AudiaHybrid establishes a unified live link: **ESP32 (Wokwi simulation or physical DevKit) -> MQTT Broker -> Web Dashboard & Backend Database**.

### Data Contract

| Property | Specification |
| :--- | :--- |
| **MQTT Broker** | `broker.hivemq.com` |
| **Firmware Transport** | TCP Port `1883` |
| **Browser Transport** | Secure WebSockets `wss://broker.hivemq.com:8884/mqtt` |
| **Telemetry Topic** | `audiahybrid/cyril-raj/telemetry` (published every 500 ms) |
| **Status Topic** | `audiahybrid/cyril-raj/status` (retained, LWT `"offline"`, payload `"online"`) |
| **Link Alive Threshold**| Level > `300` (Simulation raw ADC) or > `40` (Hardware RMS signal) |
| **Telemetry JSON Schema** | `{"optical":int 0-4095, "rf":int 0-4095, "opt_ok":bool, "rf_ok":bool, "preferred":"optical"\|"rf", "active":"optical"\|"rf"\|"none", "rssi":int}` |

---

### 1. How to Run the Wokwi Simulation

1. **Build the firmware**:
   ```bash
   pio run -d firmware
   ```
2. **Start the simulation**:
   - In VS Code, press `F1` (or `Ctrl+Shift+P` / `Cmd+Shift+P`), type **`Wokwi: Start Simulator`**, and hit Enter.
   - Alternatively, open [firmware/diagram.json](file:///c:/Users/Cyril/Documents/College/Year%202/FSWD/FSWD%20PROJECT/Final%20AudiaHybrid/firmware/diagram.json) in VS Code with the Wokwi extension installed.
3. **Simulate Live Controls**:
   - **Potentiometer 1 (pot_opt / GPIO34)**: Simulates the Optical flux level (0–4095).
   - **Potentiometer 2 (pot_rf / GPIO35)**: Simulates the RF signal strength (0–4095).
   - **Slide Switch (sw / GPIO14)**: Toggles preferred link mode (Left/HIGH = Optical, Right/LOW = RF).
   - **LEDs**: Blue = Optical alive (GPIO25), Orange = RF alive (GPIO26), Green = Active link valid (GPIO27).
4. **View Live Dashboard**:
   - Run `npm run dev` in `client/` and open `http://localhost:5173`.
   - The **Live ESP32 Hardware Link** panel displays both badges green (`Broker Connected`, `ESP32 Online`) and updates charts in real time.

---

### 2. How to Switch to Real Hardware

1. **Configure build mode**:
   In [firmware/platformio.ini](file:///c:/Users/Cyril/Documents/College/Year%202/FSWD/FSWD%20PROJECT/Final%20AudiaHybrid/firmware/platformio.ini), change the build flag to `SIMULATION=0`:
   ```ini
   build_flags =
       -DSIMULATION=0
   ```
2. **Configure Wi-Fi credentials**:
   Copy [firmware/src/secrets.example.h](file:///c:/Users/Cyril/Documents/College/Year%202/FSWD/FSWD%20PROJECT/Final%20AudiaHybrid/firmware/src/secrets.example.h) to `firmware/src/secrets.h`:
   ```cpp
   #pragma once
   #define SECRET_WIFI_SSID "Your_WiFi_Network"
   #define SECRET_WIFI_PASS "Your_WiFi_Password"
   ```
3. **Flash ESP32**:
   Connect your ESP32 Dev Board via USB and flash:
   ```bash
   pio run -d firmware -t upload
   ```
4. **Monitor serial console**:
   ```bash
   pio run -d firmware -t monitor
   ```

---

### 3. Hardware Pinout & Circuit Schematic

| Component | ESP32 Dev Board Pin | Notes / Circuit Connection |
| :--- | :--- | :--- |
| **Optical Receiver Output** | `GPIO34` (ADC1 Channel 6) | 10k series resistor to node X; node X has 10k pull-up to 3V3 and 10k pull-down to GND. |
| **RF Receiver Output** | `GPIO35` (ADC1 Channel 7) | Same 10k DC bias divider to node Y -> GPIO35. |
| **Preferred Mode Switch** | `GPIO14` | SPST/Slide Switch to GND (`INPUT_PULLUP`). HIGH = Optical preferred, LOW = RF preferred. |
| **Optical Alive LED** | `GPIO25` | Blue LED in series with 220Ω current-limiting resistor to GND. |
| **RF Alive LED** | `GPIO26` | Orange LED in series with 220Ω current-limiting resistor to GND. |
| **Active Link LED** | `GPIO27` | Green LED in series with 220Ω current-limiting resistor to GND. |
| **Common Ground** | `GND` | Common ground shared between receiver analog circuits and ESP32 GND. |

> [!WARNING]
> Never apply voltages exceeding 3.3V to any ESP32 GPIO pin. Only use ADC1 pins (GPIO 32–39) for analog readings, as ADC2 is disabled when the Wi-Fi subsystem is active.

---

### 4. Troubleshooting Table

| Symptom / Issue | Probable Cause | Corrective Action |
| :--- | :--- | :--- |
| **Broker badge shows Disconnected** | Browser cannot reach HiveMQ WebSocket endpoint | Ensure internet connectivity. Check that firewall allows outbound traffic on port `8884` (WSS). Verify `VITE_MQTT_URL` in `client/.env`. |
| **ESP32 badge shows Offline** | ESP32 is not connected or MQTT client timed out | Check Wi-Fi SSID/password in `firmware/src/secrets.h`. Ensure 2.4 GHz Wi-Fi is used. Check serial monitor (`pio run -d firmware -t monitor`). |
| **Link shows Dead when pot is adjusted** | Signal below alive threshold | Simulation threshold is `300` raw counts. Hardware RMS threshold is `40`. Turn pot clockwise to increase signal level. |
| **Failover not switching to RF** | Switch set to RF mode or RF signal also below threshold | Ensure RF pot/signal is above alive threshold. If Optical dies, failover automatically switches to RF. |
| **Backend `/api/hardware/readings` empty** | Backend not subscribed to topic or Prisma table not created | Run `npm run prisma:push` inside `backend/`. Verify `MQTT_TOPIC="audiahybrid/cyril-raj/telemetry"` in `backend/.env`. |

---

## 🚀 Quickstart

### Client (Frontend)
```bash
cd client
npm install
npm run dev
```
Visit `http://localhost:5173`.

### Backend (Telemetry Persistence & API)
```bash
cd backend
npm install
npm run prisma:push
npm start
```
API endpoints available at `http://localhost:4000/api/hardware/readings` and `http://localhost:4000/api/health`.

### Firmware (ESP32)
```bash
pio run -d firmware
```
