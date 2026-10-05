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
          light: '#F4F3FB',
          dark: '#0F0D24',
        },
        primary: {
          dark: '#25196B',
          DEFAULT: '#25196B',
          light: '#3C2E8E',
          hover: '#1B1152',
        },
        accent: {
          DEFAULT: '#F59E6C',
          hover: '#E58952',
          light: '#FFD3BA',
        },
        text: {
          primary: '#1B1740',
          secondary: '#5B5878',
          darkPrimary: '#ECEBFA',
          darkSecondary: '#A5A2CA',
          onDark: '#FFFFFF',
        },
        status: {
          success: '#4CC9A0',
          warning: '#F5B94C',
          danger: '#E5586E',
        }
      },
      fontFamily: {
        sans: ['Urbanist', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'frame': '40px',
        'frame-mobile': '28px',
        'card': '28px',
        'pill': '9999px',
      },
      boxShadow: {
        'glass': '0 10px 40px rgba(60, 50, 120, 0.15)',
        'glass-dark': '0 10px 40px rgba(0, 0, 0, 0.4)',
        'glass-hover': '0 15px 45px rgba(60, 50, 120, 0.22)',
        'glow-accent': '0 0 25px rgba(245, 158, 108, 0.35)',
      },
      backdropBlur: {
        'glass': '18px',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(0.95)' },
        }
      },
      animation: {
        'fade-in': 'fade-in 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
