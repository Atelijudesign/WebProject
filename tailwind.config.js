/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./*.html",
    "./blog/**/*.html",
    "./project/**/*.html",
    "./tool/*.html",
    "./js/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        "bim-blue": "#3b82f6",
        "bim-dark": "#0b1220",
        "bim-card": "#111827",
        "bim-border": "#1f2937",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
