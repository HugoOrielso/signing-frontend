import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        ink: "#1a1a2e",
        gold: "#c9a84c",
        goldDark: "#a07830",
        cream: "#f5f0e8",
        borderSoft: "#d4c9b0",
        muted: "#7a6e5f",
      },
    },
  },

  plugins: [],
};

export default config;