# AudiaHybrid – Live Telemetry & Information Platform

> Full Stack Web Development Capstone Project (**Course Code: 25SC2008E**) • KL University  
> Platform for **Hybrid RF–Optical Assistive Listening System Using Analog Signal Processing**.

---

## 🚀 Overview

AudiaHybrid provides real-time telemetry streaming, interactive circuit architecture explorers, and historical analytics for an analog dual-carrier assistive listening device.

- **Radio Frequency (RF)**: Long-range, non-line-of-sight signal penetration (~100 MHz AM band).
- **Optical (LED–Photodiode)**: 100% electromagnetic noise-immune, privacy-confined transmission using high-brightness LEDs and BPW34 silicon PIN photodiodes.
- **Pure Analog Processing**: Eliminates ADC/DAC digital buffering latency (&lt;0.1 ms throughput).

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, React Router v7, Tailwind CSS, Lucide React, Plus Jakarta Sans
- **State Management**: React Context (`ThemeContext`) with persistence (`localStorage`)
- **Backend (Phase 4–6)**: Node.js (LTS), Express, PostgreSQL (`pg`), MQTT.js, Socket.io
- **Real-Time Pipeline**: Hardware / ESP32 Simulator $\rightarrow$ Public MQTT Broker $\rightarrow$ Express Bridge $\rightarrow$ Socket.io $\rightarrow$ React Telemetry HUD

---

## 🎨 Design System

Clean, high-contrast engineering console theme inspired by modern developer and instrumentation platforms:

- **Primary Colors**: Slate (`slate-900` / `slate-950`), Electric Blue (`brand-600` / `#2563EB`)
- **Channel Indicators**:
  - 🔵 **RF Channel**: Electric Blue (`#3B82F6`)
  - 🟡 **Optical Channel**: Amber (`#F59E0B`)
  - 🟣 **Hybrid Dual-Link**: Violet (`#8B5CF6`)
  - 🟢 **Audio Level / OK**: Emerald (`#10B981`)
- **Typography**: **Plus Jakarta Sans** (weights 400, 500, 600, 700) with monospace technical labels
- **Accessibility**: High-Contrast Mode, Large-Text Mode (125%), Skip Link, WCAG AA $\ge 4.5:1$ contrast

---

## 💻 Running the Client

```bash
# Navigate to the client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev

# Run linter
npm run lint

# Build production bundle
npm run build
```
