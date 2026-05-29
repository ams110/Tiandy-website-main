/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette (corporate blue, security-vendor style) — re-theme here
        brand: {
          50: '#e8f1fb',
          100: '#c7ddf5',
          200: '#93bdec',
          300: '#5b98df',
          400: '#2e76d0',
          500: '#1559b5',
          600: '#0f4794',
          700: '#0d3a77',
          800: '#0c2f5f',
          900: '#0a2547',
        },
        // Cyan accent for highlights / hover states
        accent: {
          400: '#22c1d6',
          500: '#06a6c2',
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
