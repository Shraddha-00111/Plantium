/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#4CAF50",
        secondary: "#81C784",
        // background: "#FFFFFF",
        lightGray: "#F5F5F5",
        textDark: "#333333",
        textLight: "#777777",
        primary: '#34A853',        // button‐fills, header bars
        'primary-dark': '#2C8C46', // pressed/active states
        background: '#E8F5E9',     // overall screen background
        surface: '#FFFFFF',        // card & scrollview background
        'text-primary': '#1F2937', // headings
        'text-secondary': '#4B5563', // body copy

      }
    },
  },
  plugins: [],
}