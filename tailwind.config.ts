import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef4fb",
          100: "#d8e6f6",
          200: "#b3cdea",
          300: "#8bb4df",
          400: "#4f82bf",
          500: "#1453a5",
          600: "#11498f",
          700: "#0d3870",
          800: "#092a54",
          900: "#061b37",
        },
        brand: {
          blue: "#1453a5",
          yellow: "#ffcc29",
          green: "#097a53",
          orange: "#f7932d",
          "orange-light": "#fbbb7d",
          "off-white": "#f4f4f4",
          "off-white-background": "#fffcf9",
          "cyan-light": "#8fd4d7",
          cyan: "#12b6b5",
          "green-2": "#54bf9e",
          "blue-light": "#72b3e2",
          "yellow-light": "#ffe08a",
          black: "#1e1e1e",
        },
      },
      fontFamily: {
        sans: ["var(--font-body)", "sans-serif"],
        base: ["var(--font-base)", "sans-serif"],
        display: ["var(--font-display)", "sans-serif"],
        heading: ["var(--font-heading)", "sans-serif"],
        button: ["var(--font-button)", "sans-serif"],
        arabic: ["var(--font-arabic)", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
