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
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        aurora: {
          "0%, 100%": { transform: "translate(0%, 0%) scale(1)" },
          "50%": { transform: "translate(-5%, 5%) scale(1.05)" },
        },
      },
      animation: {
        aurora: "aurora 15s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
