/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        page: {
          light: '#D9DEE4',
          dark: '#0E0F11',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#17181B',
          subtle: '#F5F5F3',
          subtleDark: '#1D1F23',
        },
        card: {
          light: '#FFFFFF',
          dark: '#1D1F23',
        },
        ink: {
          DEFAULT: '#0B0B0C',
          light: '#0B0B0C',
          dark: '#F2F2F0',
          secondary: '#55575C',
          secondaryDark: '#9A9CA1',
        },
        accent: {
          lime: '#C6F36B',
          DEFAULT: '#C6F36B',
        },
        hairline: {
          light: '#C9CCD1',
          dark: '#33363B',
        },
        sky: {
          light: '#F4F7FA',
          mid: '#CFE2F3',
          blue: '#9CC3E6',
        },
        badge: {
          rf: '#2F6FED',
          optical: '#F2A33A',
          hybrid: '#0B0B0C',
        },
        status: {
          ok: '#2FBF71',
          warn: '#F2A33A',
          danger: '#E5484D',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'frame': '28px',
        'panel': '24px',
        'card': '20px',
        'pill': '9999px',
      },
      boxShadow: {
        'subtle': '0 1px 2px rgba(0, 0, 0, 0.06)',
        'floating': '0 8px 24px rgba(0, 0, 0, 0.08)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.05)',
      },
      letterSpacing: {
        'headline': '-0.03em',
        'label': '0.04em',
      },
      lineHeight: {
        'headline': '1.02',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'float-slow-alt': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(6px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 250ms ease-out forwards',
        'float-slow': 'float-slow 5s ease-in-out infinite',
        'float-slow-alt': 'float-slow-alt 6s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
