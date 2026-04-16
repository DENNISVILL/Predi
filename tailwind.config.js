/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        background: '#040B16',      /* Deep Space Dark */
        surface: '#0A1526',         /* Dark Surface */
        'surface-hover': '#112240', /* Slightly lighter */
        primary: {
          DEFAULT: '#00F0FF',       /* Cyberpunk Cyan */
          glow: 'rgba(0, 240, 255, 0.5)',
        },
        secondary: {
          DEFAULT: '#7000FF',       /* Electric Purple */
          glow: 'rgba(112, 0, 255, 0.5)',
        },
        accent: {
          DEFAULT: '#00FF9D',       /* Matrix Emerald */
          glow: 'rgba(0, 255, 157, 0.5)',
        },
        text: {
          primary: '#E2E8F0',
          secondary: '#94A3B8',
          muted: '#475569'
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gods-eye': 'conic-gradient(from 180deg at 50% 50%, #00F0FF22 0deg, #7000FF22 180deg, #00F0FF22 360deg)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Space Grotesk', 'monospace'],
        display: ['Outfit', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 15s linear infinite',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'draw-line': 'drawLine 1s ease-out forwards',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 1, boxShadow: '0 0 20px var(--tw-shadow-color)' },
          '50%': { opacity: 0.5, boxShadow: '0 0 5px var(--tw-shadow-color)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        drawLine: {
          '0%': { strokeDasharray: '0 1000' },
          '100%': { strokeDasharray: '1000 0' },
        }
      }
    },
  },
  plugins: [],
}