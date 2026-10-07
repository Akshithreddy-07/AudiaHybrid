# AudiaHybrid – Precision Telemetry & Monitoring Dashboard

Live monitoring, diagnostics, and historical analytics platform for a Hybrid RF–Optical Assistive Listening System. Built with a lab-instrument and datasheet aesthetic (oscilloscope front panel styling, dark `#0F1214` default theme, hairline rules, tabular monospace metrics, and pure analog audio loopback).

---

## 1. Quick Start & Run Commands

### Install Dependencies
```bash
cd client
npm install
```

### Start Development Server
```bash
npm run dev
```
> Access at **`http://localhost:5173/`**

### Run Unit Tests (Vitest)
```bash
npm test
```
> Runs 17 test cases verifying unit conversions (counts, %, approx. mV), statistical metrics (jitter, packet rates, dropped intervals), hysteresis link recommendation, and RFC 4180 CSV generation.

### Build & Preview Production Bundle
```bash
npm run build
npm run preview
```

---

## 2. Environment Variables

| Variable | Description | Default (Local Dev) |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base URL for backend Express REST and Socket.io endpoints | `http://localhost:4000` (proxied via Vite `/api` and `/socket.io`) |

Example `.env.production`:
```env
VITE_API_URL=https://audiahybrid-api.onrender.com
```

---

## 3. Vercel Deployment Configuration

- **Framework Preset**: Vite
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: Set `VITE_API_URL` to your production backend URL.

---

## 4. Application Architecture & Four Scoped Pages

| Route | Page | Description |
| :--- | :--- | :--- |
| `/` | **Dashboard** | 4 primary instrument tiles (Optical flux, RF level, Wi-Fi RSSI, Active link), hysteresis link recommendation, 3 stacked Chart.js graphs, raw Web Audio loopback panel, and event log. |
| `/telemetry` | **Telemetry** | Pipeline hop status strip (ESP32 > MQTT > Express > Socket.io > Browser), message rate, jitter, dropped-interval count, signal-to-floor ratios, ADC distribution histogram, and latest 50 raw packets monospace table. |
| `/records` | **Records** | Multi-hour historical comparison plot with 1h/24h/7d presets, active-only filter, resolution bucket selector, paginated table, and client-side RFC 4180 CSV export. |
| `/about` | **About** | Technical project statement, interactive SVG signal chain diagram, Design vs Prototype tradeoff table, and telemetry explanation. |

---

## 5. Keyboard Shortcuts

- `1` : Link focus -> Both (Optical & RF)
- `2` : Link focus -> Optical Only
- `3` : Link focus -> RF Only
- `Space` : Pause / Resume telemetry feed
- `T` : Toggle theme (Dark / Light)
- `?` : Open keyboard shortcuts dialog
- `Esc` : Close dialogs and popovers
