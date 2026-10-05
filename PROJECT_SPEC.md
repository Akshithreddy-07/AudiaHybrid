# AudiaHybrid – Full Stack Web Development Project
### Master Spec & Architecture Document (Course: 25SC2008E)

## 1. Project Overview
**Name**: AudiaHybrid – Live Monitoring & Information Platform for a Hybrid RF–Optical Assistive Listening System.
**ECE Background**: Assistive listening system transmitting analog audio concurrently over:
1. **Radio Frequency (RF)**: Long range, non-line-of-sight, resilient to physical obstruction, susceptible to EM interference.
2. **Optical (High-Brightness LED & BPW34 Photodiode)**: Line-of-sight, immune to RF noise, secure, susceptible to ambient light.
**Analog Signal Chain**:
Electret Mic -> LM741 Pre-amp -> RC Filter -> Buffer -> Tone Control -> AM Modulator -> RF Tx & LED Tx -> RF Rx & Photodiode -> Envelope Demodulator -> LM386 Audio Power Amp -> Speaker/Headphones.

**Web Platform ("SignalDash" Architecture)**:
Hardware Telemetry / Simulator -> MQTT Broker -> Node.js Express Backend (Bridge + Throttling + Batch Postgres persistence) -> Socket.io WebSocket -> React Frontend (Live Recharts, Redux Toolkit, Tailwind & Glassmorphism UI) + PostgreSQL History.

## 2. Tech Stack
- **Frontend**: React 18, Vite, React Router v6, Redux Toolkit, Tailwind CSS, Lucide React, Axios, Recharts, Socket.io-client, @fontsource/urbanist.
- **Backend**: Node.js (LTS), Express, PostgreSQL (`pg`), Socket.io, MQTT.js, Helmet, CORS, Morgan, Express-Rate-Limit, Express-Validator, Bcrypt, JsonWebToken.
- **Message Broker**: Public MQTT Broker (`broker.hivemq.com` or `test.mosquitto.org`).
- **Database**: PostgreSQL with parameterized queries.
- **Auth**: JWT + bcrypt with Role-Based Access Control (`user`, `admin`).
- **Deployment**: Vercel (Client) + Render (Backend & PostgreSQL).

## 3. Monorepo Structure
audiahybrid/
  README.md
  PROJECT_SPEC.md
  .github/workflows/ci.yml
  client/                 (React + Vite)
    src/
      api/
      app/
      components/
      data/
      features/
      hooks/
      pages/
      main.jsx, App.jsx, index.css
    .env.example
  server/                 (Node + Express)
  simulator/              (publisher.js)
