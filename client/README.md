# AudiaHybrid – Client Application

> Frontend web application for the AudiaHybrid Assistive Listening Platform built with React 18, Vite, Tailwind CSS, and React Router v6.

---

## 🎨 Glassmorphism Design Tokens

The UI follows a soft dusk-sky floating glass aesthetic:

| Token | CSS Variable / Class | Value | Notes |
| :--- | :--- | :--- | :--- |
| **Page Background (Light)** | `--bg-page` / `bg-page-light` | `#F4F3FB` | Soft lavender-white |
| **Page Background (Dark)** | `--bg-page` / `bg-page-dark` | `#0F0D24` | Deep twilight navy |
| **Primary Navy** | `--color-primary-dark` / `bg-primary-dark` | `#25196B` | Buttons, badge, active navigation |
| **Accent Orange** | `--color-accent` / `bg-accent` | `#F59E6C` | Direction arrows, focus rings, highlights |
| **Text Primary (Light)** | `--text-main` / `text-text-primary` | `#1B1740` | High contrast WCAG AA compliant |
| **Text Secondary (Light)** | `--text-muted` / `text-text-secondary` | `#5B5878` | Subtitles, helper text |
| **Hero Sky Gradient** | `--sky-grad` | `#8FB3E8` $\rightarrow$ `#C9B8E8` $\rightarrow$ `#F6CDB8` | Soft periwinkle to peach gradient |
| **Warm Hero Glow** | `--sky-glow` | `#FFB88A` @ 28% opacity | Center bottom ambient glow |
| **Glass Surface** | `.glass-panel` | `rgba(255,255,255,0.55)` | `backdrop-filter: blur(18px)`, 1px border |
| **Outer Frame Radius** | `rounded-frame` | `40px` (Desktop) / `28px` (Mobile) | Floating outer container |
| **Card Radius** | `rounded-card` | `28px` | Interactive cards |
| **Pill Radius** | `rounded-pill` | `9999px` | Buttons, badges, selects |
| **Primary Typography** | `font-sans` | `Urbanist`, sans-serif | Self-hosted via `@fontsource/urbanist` (300, 400, 500, 600) |

---

## ♿ Accessibility Modes

1. **High Contrast Mode (`.high-contrast`)**:
   - Replaces translucent frosted glass panels with solid white/black backgrounds.
   - Applies sharp 2px solid borders and disables background blur and text gradients.
   - Stored and persisted in `localStorage` (`audia_high_contrast`).

2. **Large Text Mode (`.large-text`)**:
   - Scales root font size to 125% for enhanced readability.
   - Stored and persisted in `localStorage` (`audia_large_text`).

3. **Focus States & Reduced Motion**:
   - 3px solid `#F59E6C` focus ring with 2px offset on all interactive elements.
   - Automatically halts CSS transitions and animations when `prefers-reduced-motion: reduce` is active.

---

## 🚀 Running the Client Locally

```bash
# 1. Navigate to client directory
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

---

## 🌐 Deploying to GitHub Pages or Vercel

### GitHub Pages Note:
If deploying to GitHub Pages under a sub-path (e.g. `https://<username>.github.io/AudiaHybrid/`), set `base: '/AudiaHybrid/'` in `vite.config.js`:
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // or '/<repo-name>/'
});
```

### Vercel / Netlify Note:
Ensure single-page routing rewrites are enabled for client-side routing.
