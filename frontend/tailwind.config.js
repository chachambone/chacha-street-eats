/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#E53E3E', // Bold red-orange (nyama choma vibes)
        accent: '#F6AD55', // Warm orange
        dark: '#2D3748',
        light: '#FDFDFD',
      },
    },
  },
  plugins: [],
}