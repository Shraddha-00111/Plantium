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
        background: "#FFFFFF",
        lightGray: "#F5F5F5",
        textDark: "#333333",
        textLight: "#777777"
      }
    },
  },
  plugins: [],
}