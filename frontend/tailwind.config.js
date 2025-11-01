/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#E8F1FF',
          100: '#CDE1FF',
          200: '#AFCFFF',
          300: '#8FB9FF',
          400: '#6AA4FF',
          500: '#3A8AFF',
          600: '#1F74F0',
          700: '#155CD0',
          800: '#0E45A8',
          900: '#0A327A',
          DEFAULT: '#3A8AFF',
          hover: '#1F74F0',
          surface: '#E8F1FF',
          text: '#1A1A1A',
          muted: '#4A5568',
        },
        danger: {
          500: '#ef4444',
          600: '#dc2626',
        }
      }
    },
  },
  plugins: [],
}