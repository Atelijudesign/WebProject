/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./*.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./blog/**/*.html",
    "./project/**/*.html",
    "./tool/*.html",
    "./js/**/*.js",
    "./proyectos-bim/**/*.{html,js}"
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
        head: ["Space Grotesk", "sans-serif"],
        mono: ["Fira Code", "monospace"],
      },
      spacing: {
        "4.5": "1.125rem", // 18px
      },
    },
  },
  corePlugins: {
    // Preflight desactivado intencionalmente para evitar conflictos con los resets de diseño y variables globales de src/styles/index.css
    preflight: false,
  },
  plugins: [],
};
