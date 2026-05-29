/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette — built around the official Tiandy green #42d229.
        // 500 is the exact brand green; 600-900 darken for text/contrast.
        brand: {
          50: '#edfbe8',
          100: '#d4f6ca',
          200: '#aaed96',
          300: '#7ce25c',
          400: '#59d836',
          500: '#42d229',
          600: '#34aa1f',
          700: '#29821b',
          800: '#23671a',
          900: '#1e5418',
        },
        // Brighter green accent for highlights / hover states
        accent: {
          400: '#6ee84f',
          500: '#42d229',
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
