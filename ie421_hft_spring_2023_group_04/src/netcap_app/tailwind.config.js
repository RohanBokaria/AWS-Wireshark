/** @type {import('tailwindcss').Config} */
const withMT = require('@material-tailwind/react/utils/withMT')
import tailwindScrollbar from 'tailwind-scrollbar'

module.exports = withMT({
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [tailwindScrollbar({ nocompatible: true })],
})
