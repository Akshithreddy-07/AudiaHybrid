/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Lab Instrument & Datasheet palette
        instrument: {
          paper: 'var(--color-paper)',
          ink: 'var(--color-ink)',
          panel: 'var(--color-panel)',
          rules: 'var(--color-rules)',
          muted: 'var(--color-muted)',
          subtle: 'var(--color-subtle)',
        },
        // Strict Data-Only Palette
        data: {
          optical: '#EF9F27', // Amber
          rf: '#378ADD',      // RF Blue
          healthy: '#5DCAA5', // Healthy/Connected Green
          fault: '#E5484D',   // Fault/Alert Red
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'Menlo', 'Consolas', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '4px',
        sm: '2px',
        md: '4px',
        lg: '4px',
      },
      maxWidth: {
        prose: '68ch',
      },
      transitionDuration: {
        DEFAULT: '150ms',
      },
    },
  },
  plugins: [],
}
