/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  './src/**/*.{html,ts}',
  './src/**/**/*.{html,ts}',
  '*.{html,ts}'
],
  safelist:[
    'bg-red-400',
    'bg-blue-400',
    'bg-green-400'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
