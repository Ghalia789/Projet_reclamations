/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0f766e",
          700: "#0f5f5a"
        },
        accent: {
          500: "#f97316",
          600: "#ea580c"
        }
      },
      boxShadow: {
        soft: "0 18px 40px rgba(15, 23, 42, 0.08)",
        glow: "0 12px 24px rgba(15, 118, 110, 0.12)",
        accent: "0 14px 30px rgba(249, 115, 22, 0.35)"
      }
    }
  },
  plugins: []
};
