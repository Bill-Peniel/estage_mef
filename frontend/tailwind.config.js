/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
	"./index.html",
	"./src/**/*.{vue,js,ts,jsx,tsx}",
],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#166534', // green-800
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        secondary: {
          DEFAULT: '#1E3A8A', // bleu nuit
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        'primary-light': '#22C55E',
        'primary-dark': '#14532D',
        'secondary-light': '#3B82F6',
        'secondary-dark': '#1E40AF',
        'accent-yellow': '#F59E0B',
        'accent-teal': '#14B8A6',
      },
    },
  },
  plugins: [],
}

