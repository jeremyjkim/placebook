/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        ink: '#0f172a',
      },
      boxShadow: {
        card: '0 10px 30px rgba(15, 23, 42, 0.08)',
        sheet: '0 -10px 40px rgba(15, 23, 42, 0.12)',
      },
    },
  },
  plugins: [],
}
