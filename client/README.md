# AudiaHybrid – Client Application

> Frontend web application for the AudiaHybrid Assistive Listening Platform built with React 18, Vite, Tailwind CSS, and React Router v6 using a modern **editorial split-hero** design system.

---

## 🎨 Editorial Design Tokens

The UI follows a clean, minimal, editorial split-hero aesthetic with crisp solid cards, high-contrast typography, and a subtle lime accent:

| Token | CSS Variable / Tailwind | Value | Usage |
| :--- | :--- | :--- | :--- |
| **Page Background (Outer)** | `--bg-outer` / `bg-page-light` | `#D9DEE4` | Cool light grey-blue canvas outside frame |
| **Page Background (Dark)** | `--bg-outer` / `bg-page-dark` | `#0E0F11` | Deep obsidian canvas |
| **Surface / Card (Light)** | `--bg-surface` / `bg-card-light` | `#FFFFFF` | Solid white cards, left column |
| **Subtle Surface** | `--bg-subtle` / `bg-surface-subtle` | `#F5F5F3` | Section background, input fields, chips |
| **Ink / Primary Text** | `--color-ink` / `text-ink` | `#0B0B0C` | Headlines, primary pill buttons, active nav |
| **Ink Secondary** | `--color-ink-secondary` | `#55575C` | Subtitles, helper text, captions |
| **Hairlines / Dividers** | `--color-hairline` | `#C9CCD1` | 1px clean card borders and dashed dividers |
| **Accent Lime** | `--color-accent-lime` | `#C6F36B` | Small square bullets, active dots, badges |
| **Sky Illustration Tones** | `sky-blue`, `sky-mid`, `sky-light` | `#9CC3E6`, `#CFE2F3`, `#F4F7FA` | Vector hero artwork gradient |
| **RF Channel Badge** | `badge-rf` | `#2F6FED` | Blue RF tag and indicator |
| **Optical Channel Badge** | `badge-optical` | `#F2A33A` | Amber Optical tag and indicator |
| **Hybrid Badge** | `badge-hybrid` | `#0B0B0C` | Black Hybrid badge |
| **Status OK / Warn / Danger** | `status-ok`, `warn`, `danger` | `#2FBF71`, `#F2A33A`, `#E5484D` | Telemetry link status indicators |
| **Frame Radius** | `rounded-frame` | `28px` | Outer 1360px container frame |
| **Panel Radius** | `rounded-panel` | `24px` | Hero image illustration panel |
| **Card Radius** | `rounded-card` | `20px` | Solid editorial cards |
| **Pill Radius** | `rounded-pill` | `9999px` | Buttons, navigation pills, floating chips |
| **Typography** | `font-sans` | **Plus Jakarta Sans** | Headline weight 600, tight tracking (`-0.03em`) |

---

## ♿ Accessibility Features

1. **High Contrast Mode (`.high-contrast`)**:
   - Pure solid `#FFFFFF` / `#000000` surfaces with sharp 2px solid borders.
   - Disables all illustrations behind text, glows, and shadows.
   - Stored and persisted in `localStorage` (`audia_high_contrast`).

2. **Large Text Mode (`.large-text`)**:
   - Scales root font size to 125% while fluid clamps prevent horizontal clipping.
   - Stored and persisted in `localStorage` (`audia_large_text`).

3. **Accessible Focus Outlines & Reduced Motion**:
   - 3px solid focus ring (`#2F6FED` on light, `#C6F36B` on dark) with 2px offset.
   - Automatically disables animations and transitions under `prefers-reduced-motion: reduce`.
   - `SkipLink` provides keyboard navigation directly to `#main-content`.

---

## 🚀 Running the Client Locally

```bash
# 1. Enter client directory
cd client

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build for production
npm run build

# 5. Preview production build
npm run preview
```
