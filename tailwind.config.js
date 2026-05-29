/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette — green matched to the official Tiandy wordmark.
        // 500 is the bright brand green; 600-900 darken for text/contrast.
        brand: {
          50: '#ecfaec',
          100: '#d2f4d2',
          200: '#a6e7a6',
          300: '#72d672',
          400: '#4ccb4c',
          500: '#3dc63d',
          600: '#2ea82e',
          700: '#248524',
          800: '#1f6b1f',
          900: '#1a571a',
        },
        // Brighter green accent for highlights / hover states
        accent: {
          400: '#5ad65a',
          500: '#34c734',
        },
      },
      fontFamily: {
        sans: ['Heebo', 'Rubik', 'system-ui', 'sans-serif'],
      },
      container: {
        center: true,
        padding: '1rem',
      },
    },
  },
  plugins: [],
}
