/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#061222',
          900: '#0B1F3A', // Primary Navy
          850: '#0F2647',
          800: '#142F54',
          700: '#1D4175',
          600: '#2A5899',
          500: '#3D74BF',
          100: '#E8EFF8',
          50: '#F0F5FA',
        },
        saffron: {
          DEFAULT: '#FF9933', // Saffron Accent
          50: '#FFF7EB',
          100: '#FFEED6',
          200: '#FFD9AD',
          300: '#FFC17F',
          400: '#FFAA52',
          500: '#FF9933',
          600: '#E67E17',
          700: '#BF6109',
        },
        igreen: {
          DEFAULT: '#138808', // Indian Green
          50: '#EDF8EE',
          100: '#D5F0D7',
          200: '#ADE0B1',
          300: '#7DC883',
          400: '#46AE4E',
          500: '#138808',
          600: '#0E6C06',
          700: '#0A5204',
        },
        surface: {
          bg: '#F5F7FA',
          card: '#FFFFFF',
          sidebar: '#0B1F3A',
          border: '#E2E8F0',
          hover: '#F1F5F9',
        },
        txt: {
          primary: '#172033',
          secondary: '#667085',
          muted: '#94A3B8',
          inverted: '#FFFFFF',
        },
        status: {
          success: '#138808',
          warning: '#F4B400',
          error: '#C62828',
          info: '#1A73E8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans', 'system-ui', 'sans-serif'],
        display: ['Inter', 'Noto Sans', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(11, 31, 58, 0.05), 0 1px 2px 0 rgba(11, 31, 58, 0.03)',
        'card': '0 2px 6px -1px rgba(11, 31, 58, 0.08), 0 1px 4px -1px rgba(11, 31, 58, 0.04)',
        'card-hover': '0 10px 25px -3px rgba(11, 31, 58, 0.1), 0 4px 6px -2px rgba(11, 31, 58, 0.05)',
        'header': '0 1px 4px 0 rgba(11, 31, 58, 0.08)',
      },
    },
  },
  plugins: [],
}
