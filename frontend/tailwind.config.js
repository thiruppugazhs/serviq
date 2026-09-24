/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'anek-latin': ["'Anek Latin'", "'AnekLatin'", 'sans-serif'],
        'anek': ["'Anek Latin'", "'AnekLatin'", 'sans-serif'],
        'outfit': ["'Outfit'", 'sans-serif'],
        'jakarta': ["'Plus Jakarta Sans'", 'sans-serif'],
      },
      colors: {
        serviq: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          dark: '#0f172a',
          card: '#1e293b',
        },
      },
    },
  },
  plugins: [],
}
