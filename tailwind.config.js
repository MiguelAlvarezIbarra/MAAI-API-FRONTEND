/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        navy: {
          950: '#050d1a',
          900: '#0a1628',
          800: '#0f1f3d',
          700: '#162952',
        },
        gold: {
          300: '#fcd97a',
          400: '#f7c948',
          500: '#d4a853',
          600: '#b8892e',
        }
      }
    }
  },
  plugins: []
}
