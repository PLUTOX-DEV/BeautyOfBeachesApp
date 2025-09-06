/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        logo: ['Pacifico', 'cursive'],
      },
      colors: {
        lightYellow: '#FFD700', // Adjust this color as needed
      }
    },
  },
  plugins: [],
}