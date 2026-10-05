# AudiaHybrid – Hybrid RF–Optical Assistive Listening Platform

[![Phase 1 Status](https://img.shields.io/badge/Phase%201-Complete%20(Theme%20Edition)-4CC9A0)](#)
[![Tech Stack](https://img.shields.io/badge/Stack-React%2018%20%7C%20Vite%20%7C%20Tailwind%20%7C%20Glassmorphism-25196B)](#)
[![Course](https://img.shields.io/badge/Course-25SC2008E%20FSWD-F59E6C)](#)

AudiaHybrid is a live telemetry monitoring and informational web platform for a dual-link hybrid RF (non-line-of-sight) and Optical (interference-free) assistive listening device powered by analog signal processing.

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
│   │   ├── components/             # Reusable glassmorphic UI components
│   │   │   ├── AccessibilityPopover.jsx
│   │   │   ├── AppFrame.jsx
│   │   │   ├── BottomNav.jsx
│   │   │   ├── GlassCard.jsx
│   │   │   ├── IconRail.jsx
│   │   │   ├── LogoBadge.jsx
│   │   │   ├── Meter.jsx
│   │   │   ├── PillBar.jsx
│   │   │   ├── PillButton.jsx
│   │   │   ├── PillSelect.jsx
│   │   │   ├── RoundIconButton.jsx
│   │   │   ├── SectionHeader.jsx
│   │   │   ├── SkipLink.jsx
│   │   │   ├── StatChip.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── context/
│   │   │   └── ThemeContext.jsx    # Dark, High Contrast, Large Text state
│   │   ├── data/                   # Static domain data
│   │   │   ├── comparison.json     # RF vs Optical trade-off matrix
│   │   │   └── recommendations.json# Pill bar decision rules
│   │   ├── pages/                  # Route views
│   │   │   ├── Admin.jsx
│   │   │   ├── Applications.jsx
│   │   │   ├── Architecture.jsx
│   │   │   ├── Bom.jsx
│   │   │   ├── Comparison.jsx      # (Fully built)
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Feedback.jsx
│   │   │   ├── History.jsx
│   │   │   ├── Home.jsx            # (Fully built)
│   │   │   ├── Login.jsx
│   │   │   ├── NotFound.jsx
│   │   │   └── Register.jsx
│   │   ├── App.jsx                 # Router & theme setup
│   │   ├── index.css               # Global glassmorphism & a11y CSS
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js          # Design tokens & glass tokens
│   └── vite.config.js
├── server/                         # Express REST API (Phase 4–6)
└── simulator/                      # MQTT Telemetry Publisher (Phase 6)
```

---

## 🚀 Quickstart

```bash
# Clone the repository and enter the client directory
cd client

# Install packages
npm install

# Run the local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.
