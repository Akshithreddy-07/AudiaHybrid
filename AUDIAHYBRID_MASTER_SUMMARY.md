# AudiaHybrid – Master Project Architecture & Technical Report

**Course**: 25SC2008E – Full Stack Web Development & Analog Signal Processing  
**Project**: AudiaHybrid (Hybrid RF + Optical Assistive Listening & Real-Time Telemetry System)  
**Author**: Cyril Raj  

---

## 1. Executive Summary & Domain Background

**AudiaHybrid** is an end-to-end cyber-physical telemetry and assistive listening platform. It bridges **analog ECE signal processing hardware** with an **IoT transport pipeline** and a **real-time web dashboard**.

```
  [ Acoustic Speech Input ]
              │
  ┌───────────┴─────────────────────────────────────────┐
  │         Analog Signal Processing Chain              │
  │  Mic Preamp ──> Bandpass RC ──> Tone Modulation     │
  └───────────┬─────────────────────────┬───────────────┘
              │                         │
     [ Optical Path ]               [ RF Path ]
   High-Brightness LED             433MHz AM Tx
   BPW34 Photodiode Rx            Regenerative Rx
              │                         │
              └────────────┬────────────┘
                           ▼
          ┌──────────────────────────────────┐
          │ ESP32 Dual Telemetry Node        │
          │ (Wokwi Simulation & Real DevKit) │
          └────────────────┬─────────────────┘
                           │ MQTT (500ms)
                           ▼
              ┌──────────────────────────┐
              │ Public MQTT Broker       │
              │ (broker.hivemq.com)      │
              └───────┬──────────┬───────┘
                      │          │
        WSS Port 8884 │          │ TCP Port 1883
                      ▼          ▼
        ┌──────────────────┐  ┌──────────────────┐
        │ React Dashboard  │  │ Express Backend  │
        │ (Live WSS Hook)  │  │ (Prisma Ingest)  │
        └──────────────────┘  └────────┬─────────┘
                                       ▼
                              ┌──────────────────┐
                              │ SQLite Database  │
                              │ (dev.db History) │
                              └──────────────────┘
```

### The Problem It Solves
Traditional assistive listening devices rely on a single transmission medium:
1. **Radio Frequency (RF)**: Penetrates walls and works non-line-of-sight (NLOS), but suffers from electromagnetic interference (EMI), RF congestion, and lack of spatial security.
2. **Optical (Visible/IR Light)**: Immune to EM noise and strictly confined to line-of-sight (LOS) spaces (high security), but blocked by physical obstructions and susceptible to ambient DC light saturation.

**The Solution**: AudiaHybrid transmits analog audio simultaneously over both channels. An **ESP32 microcontroller** monitors link quality (flux and RMS audio levels) in real time and publishes telemetry to an **MQTT message broker**. The **React web dashboard** displays link health, automatically switches audio links, and provides historical persistence via a **Node.js Express + Prisma backend**.

---

## 2. Complete Analog Signal Chain

The analog hardware pipeline consists of:
1. **Audio Ingest & Pre-amplification**:
   - Electret Microphone biased via 2.2 kΩ resistor.
   - LM741 Operational Amplifier in non-inverting configuration ($A_v \approx 20\text{--}40\,\text{dB}$).
2. **Bandpass Filtering & Conditioning**:
   - High-pass corner at 300 Hz (strips DC bias and low-frequency acoustic rumble).
   - Low-pass corner at 3.4 kHz (standard voice band telephony filter).
   - Tone control circuit with bass/treble boost/cut buffers.
3. **Dual Transmitter Stage**:
   - **Optical Transmitter**: Direct current modulation of high-brightness White/Amber LEDs using a 2N2222 transistor buffer.
   - **RF Transmitter**: 433.92 MHz AM/OOK modulation stage.
4. **Dual Receiver Stage**:
   - **Optical Receiver**: BPW34 PIN photodiode with transimpedance amplifier (TIA) + ambient DC light rejection filter.
   - **RF Receiver**: 433 MHz envelope demodulator with automatic gain adjustment.
5. **Failover & Audio Output**:
   - Analog multiplexer / switch selected by ESP32 or manual jumper.
   - LM386 Power Amplifier driving 8 Ω / 32 Ω headphones.

---

## 3. Firmware Architecture (`firmware/`)

The firmware is built using **PlatformIO** targeting the **ESP32 Dev Module (`esp32dev`)** on the **Arduino framework**.

```text
firmware/
├── platformio.ini       # PlatformIO configuration with -DSIMULATION flag
├── diagram.json         # Wokwi simulation schematic & pin bindings
├── wokwi.toml           # Wokwi simulator binary entry points
└── src/
    ├── main.cpp         # Unified ESP32 firmware (Dual SIM & HW mode)
    ├── secrets.example.h# Wi-Fi credential template (committed)
    └── secrets.h        # Local Wi-Fi credentials (git-ignored)
```

### Key Capabilities in `firmware/src/main.cpp`

1. **Dual Mode Build Configuration**:
   - `SIMULATION = 1`: Connects to `Wokwi-GUEST` SSID, samples raw ADC levels with pseudo-random jitter, threshold set to `> 300`.
   - `SIMULATION = 0`: Connects to local Wi-Fi credentials in `secrets.h`, samples 800 audio points at 100 µs spacing (80 ms window) to calculate real-time **RMS signal amplitude**, threshold set to `> 40`.
2. **Failover Decision Algorithm**:
   ```cpp
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
   ```
3. **GPIO & Pinout Mapping**:
   - `GPIO34` (ADC1 Ch 6): Optical signal level.
   - `GPIO35` (ADC1 Ch 7): RF signal level.
   - `GPIO14` (`INPUT_PULLUP`): Mode selector switch (HIGH = Prefer Optical, LOW = Prefer RF).
   - `GPIO25`: Optical Alive indicator LED (Blue).
   - `GPIO26`: RF Alive indicator LED (Orange).
   - `GPIO27`: Active Link status LED (Green).
4. **MQTT Networking & LWT**:
   - Uses `PubSubClient` and `ArduinoJson v7`.
   - Sets Last-Will-and-Testament (LWT) on `audiahybrid/cyril-raj/status` to `"offline"`.
   - Publishes `"online"` on connect with `retain = true`.
   - Publishes telemetry packet to `audiahybrid/cyril-raj/telemetry` every 500 ms.

---

## 4. MQTT Protocol & Telemetry Contract

| Field | Description | Protocol / Format |
| :--- | :--- | :--- |
| **MQTT Broker** | Public HiveMQ broker | `broker.hivemq.com` |
| **ESP32 Port** | Plain TCP | `1883` |
| **Browser Port** | Secure WebSockets (WSS) | `wss://broker.hivemq.com:8884/mqtt` |
| **Status Topic** | Retained device connection state | `audiahybrid/cyril-raj/status` (`"online"` / `"offline"`) |
| **Telemetry Topic** | 500ms sensor payload | `audiahybrid/cyril-raj/telemetry` |

### Telemetry JSON Schema
```json
{
  "optical": 2840,
  "rf": 1920,
  "opt_ok": true,
  "rf_ok": true,
  "preferred": "optical",
  "active": "optical",
  "rssi": -55
}
```

---

## 5. Backend Architecture (`backend/`)

The backend is built with **Node.js (ES Modules)**, **Express**, and **Prisma ORM** interacting with a **SQLite** database (`dev.db`).

```text
backend/
├── prisma/
│   ├── schema.prisma             # Data models (Reading, HardwareReading)
│   └── dev.db                    # Local SQLite database
├── src/
│   ├── config.js                 # Environment configuration & topics
│   ├── prisma.js                 # Prisma client instance
│   ├── server.js                 # Express server & transport initializer
│   ├── middleware/
│   │   └── errorHandler.js       # Centralized error handling
│   ├── repositories/
│   │   └── readingsRepository.js # CRUD & aggregated history queries
│   ├── routes/
│   │   └── apiRoutes.js          # REST & SSE route handlers
│   ├── services/
│   │   ├── mqttService.js        # MQTT subscriber & 1/sec throttled persistence
│   │   ├── socketService.js      # Socket.io broadcaster (/live namespace)
│   │   ├── sseService.js         # Server-Sent Events stream (/api/stream)
│   │   └── statusService.js      # Link health & staleness engine
│   └── simulator/
│       └── fakeDevice.js         # Fallback simulated telemetry generator
├── .env.example
├── .env
└── package.json
```

### Key Backend Components & API Endpoints

1. **Database Schema (`schema.prisma`)**:
   - `Reading`: General telemetry reading with timestamps and device ID.
   - `HardwareReading`: Hardware telemetry table storing `{ id, createdAt, optical, rf, rssi, active, preferred }`.
2. **Rate-Limited Storage**:
   - Telemetry arrives from ESP32 at 500 ms (2 Hz).
   - The backend ingests all packets for live WebSocket/SSE streaming but throttles persistent storage in `HardwareReading` to **at most 1 record per second**.
3. **REST Endpoints**:
   - `GET /api/hardware/readings?limit=100`: Returns recent hardware telemetry rows.
   - `GET /api/readings`: Returns recent sensor readings with pagination and time filters.
   - `GET /api/readings/history?hours=1&bucketSeconds=10`: Bucketed average time-series.
   - `GET /api/readings/summary?hours=24`: Min/Max/Mean metrics.
   - `GET /api/status`: Current link status and stale evaluation.
   - `GET /api/health`: Health status (uptime, database status, MQTT broker connection status).
   - `GET /api/stream`: SSE live telemetry stream.
   - `POST /api/telemetry`: Direct manual payload injection.

---

## 6. Frontend Architecture (`client/`)

The frontend is a **React 18** Single Page Application built on **Vite** and styled with **Tailwind CSS** following an industrial dark glassmorphism theme with IBM Plex Sans and Urbanist typography.

```text
client/
├── src/
│   ├── components/
│   │   ├── LiveHardwarePanel.jsx    # Real-time direct MQTT hardware monitor
│   │   ├── audio/LiveAudioPanel.jsx # Web Audio API synthesizer & oscilloscope
│   │   ├── charts/
│   │   │   ├── LiveStackedCharts.jsx# 3-tier live Chart.js stacked graphs
│   │   │   └── TelemetryLineChart.jsx
│   │   ├── diagrams/
│   │   │   ├── CircuitViewer.jsx    # Interactive schematic & probe visualizer
│   │   │   ├── FloorPlanDiagram.jsx # Architectural line-of-sight layout
│   │   │   └── SignalChainSvg.jsx   # ECE analog block diagram
│   │   ├── layout/
│   │   │   ├── AppFrame.jsx         # Navigation shell & landmarks
│   │   │   ├── GlobalControlBar.jsx # Threshold, smoothing & transport controls
│   │   │   └── Header.jsx / Footer.jsx
│   │   ├── tiles/
│   │   │   ├── InstrumentTile.jsx   # Metric tile with sparklines
│   │   │   └── RecommendationTile.jsx # Hysteresis decision engine tile
│   │   └── ui/
│   │       ├── AudioScope.jsx       # Real-time Web Audio canvas oscilloscope
│   │       └── EventLogTable.jsx    # Failover & connection audit table
│   ├── context/
│   │   └── ControlsContext.jsx      # Global UI filter & simulation state
│   ├── hooks/
│   │   ├── useAudiaLive.js          # Direct MQTT over WebSocket client hook
│   │   ├── useSensorData.js         # Unified Socket.io / SSE / REST hook
│   │   ├── useAudioInput.js         # Microphone / Web Audio analyser
│   │   ├── useHistory.js            # Historical database fetcher
│   │   └── useAccessibility.js      # Focus traps & shortcut handlers
│   ├── lib/
│   │   ├── api.js                   # REST API client
│   │   ├── csv.js                   # CSV report generator & downloader
│   │   ├── hysteresis.js            # Debounced link switching filter
│   │   ├── socket.js                # Socket.io client wrapper
│   │   ├── stats.js                 # Statistical math (min/max/mean/variance)
│   │   └── units.js                 # ADC counts to mV/percentage formatters
│   ├── pages/
│   │   ├── Dashboard.jsx            # Real-time monitoring command center
│   │   ├── Telemetry.jsx            # Detailed signal diagnostics & health
│   │   ├── Records.jsx              # Historical logs, filters & CSV export
│   │   └── About.jsx                # Academic ECE paper & system topology
│   ├── App.jsx                      # App root with Context Providers
│   ├── routes.jsx                   # React Router route definitions
│   └── main.jsx
├── .env.example
├── .env
├── package.json
└── vite.config.js
```

### Key Frontend Views

1. **Dashboard Page (`Dashboard.jsx`)**:
   - **`LiveHardwarePanel`**: Directly connects via `useAudiaLive` over WSS. Displays live ESP32 status badges (`Broker Connected`, `ESP32 Online`), Active Link badge, raw ADC values for Optical and RF links with alive indicators, Wi-Fi RSSI meter, and a rolling 60-sample dual-trace canvas chart.
   - **Key Instrument Tiles**: 4 diagnostic cards (Optical Flux, RF Level, Wi-Fi RSSI, Active Link) with mini sparklines.
   - **Hysteresis Recommendation Tile**: Computes optimal link transition with noise margins to prevent channel chatter.
   - **Live Stacked Time-Series Charts**: Multi-channel Chart.js line charts.
   - **Live Audio Panel & Event Log**: Live audio oscilloscope and failover audit log table.
2. **Telemetry Page (`Telemetry.jsx`)**:
   - Transport selector (Socket.io vs SSE stream).
   - Backend health monitor (uptime, database connectivity, client count).
   - Live distribution histograms and statistical summary.
3. **Records Page (`Records.jsx`)**:
   - Historical time ranges (1h, 24h, 7d) with downsampling bucket controls.
   - Interactive data table with sorting, pagination, and active-period filtering.
   - One-click CSV export utility.
4. **About Page (`About.jsx`)**:
   - Academic abstract and problem definition.
   - Detailed interactive SVG Signal Chain diagram.
   - Design vs. Prototype trade-offs table and ECE team credits.

---

## 7. Complete Verification & Testing Status

| Component / Test Suite | Scope | Status | Notes |
| :--- | :--- | :--- | :--- |
| **PlatformIO Firmware Build** | `firmware/` | **PASSED** | Compiles with `SIMULATION=1` and `SIMULATION=0`. Flash: 58%, RAM: 13.8%. |
| **Vite Client Production Build** | `client/` | **PASSED** | Transformed 1970 modules in 1.50s into production bundles. |
| **Vitest Test Suite** | `client/` | **PASSED** | 24 tests across 3 test files (DSP algorithms, utility libraries, offline routes). |
| **Backend REST & Health API** | `backend/` | **PASSED** | `GET /api/health` returns `status: ok`, `dbConnected: true`, `brokerConnected: true`. |
| **Backend Hardware Ingest** | `backend/` | **PASSED** | `GET /api/hardware/readings` successfully queries throttled SQLite database rows. |
| **Live MQTT Broker Loop** | Full Stack | **PASSED** | Verified end-to-end via `broker.hivemq.com` on ports 1883 & 8884. |

---

## 8. Summary of All Repository Files

| File / Path | Role & Purpose |
| :--- | :--- |
| `.gitignore` | Ignores dependencies, `.env` files, `.pio/` build directories, and `secrets.h`. |
| `PROJECT_SPEC.md` | Course specification and architecture document. |
| `README.md` | Complete user guide, simulation instructions, hardware pinouts, and troubleshooting table. |
| `firmware/platformio.ini` | PlatformIO build settings, ESP32 platform, and `-DSIMULATION` build flag. |
| `firmware/diagram.json` | Wokwi simulation schematic (ESP32 DevKit, potentiometers, switch, LEDs, resistors). |
| `firmware/wokwi.toml` | Wokwi VS Code extension firmware configuration. |
| `firmware/src/main.cpp` | Unified ESP32 firmware with dual simulation and RMS hardware modes. |
| `firmware/src/secrets.example.h` | Template for hardware Wi-Fi credentials. |
| `backend/package.json` | Backend dependencies (`express`, `prisma`, `mqtt`, `socket.io`, `zod`). |
| `backend/prisma/schema.prisma` | Prisma models for `Reading` and `HardwareReading`. |
| `backend/src/server.js` | Main Express server entry point and real-time service initializer. |
| `backend/src/config.js` | Environment configuration and topic constants. |
| `backend/src/services/mqttService.js` | MQTT ingestion and rate-limited database storage (1 row/sec). |
| `backend/src/routes/apiRoutes.js` | REST API endpoints including `/api/hardware/readings`. |
| `backend/src/repositories/readingsRepository.js` | Database queries for readings, hardware readings, and historical buckets. |
| `client/package.json` | Client dependencies (`react`, `vite`, `tailwindcss`, `mqtt`, `chart.js`, `lucide-react`). |
| `client/src/hooks/useAudiaLive.js` | Custom React hook subscribing to live MQTT WSS telemetry and status. |
| `client/src/components/LiveHardwarePanel.jsx` | Real-time hardware telemetry dashboard component with live canvas chart. |
| `client/src/pages/Dashboard.jsx` | Main dashboard combining live hardware panel, instrument tiles, charts, and event log. |
| `client/src/pages/Telemetry.jsx` | Telemetry transport inspection and backend diagnostics. |
| `client/src/pages/Records.jsx` | Historical data browser, filtering, statistical strip, and CSV download. |
| `client/src/pages/About.jsx` | Academic report, SVG signal chain diagram, and prototype trade-offs. |
