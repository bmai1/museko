/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gray-terminal': '#161618', 
        'gray-soft': '#b0b0b0',   
      },
    },
  },
  plugins: [],
}