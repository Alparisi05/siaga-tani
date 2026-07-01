
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nature: {
          50: '#f2fdf5',
          100: '#e1fbe9',
          200: '#c7f7d4',
          300: '#9df0b3',
          400: '#6ae28a',
          500: '#40c863',
          600: '#2fa54b',
          700: '#27833e',
          800: '#226834',
          900: '#1d552d',
          950: '#0c3017',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(34, 197, 94, 0.2), 0 0 10px rgba(34, 197, 94, 0.1)' },
          '100%': { boxShadow: '0 0 15px rgba(34, 197, 94, 0.6), 0 0 25px rgba(34, 197, 94, 0.3)' }
        }
      }
    },
  },
  plugins: [],
}
