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
        ink: {
          DEFAULT: "#0a0a0a",
          deep: "#050505",
          soft: "#121212",
          muted: "#1a1a1a",
        },
        ivory: {
          DEFAULT: "#faf8f5",
          soft: "#f5f2ed",
          dim: "#c4bdb0",
          warm: "#f9f6f1",
        },
        gold: {
          DEFAULT: "#c9a962",
          light: "#dcc48a",
          deep: "#9a7b3c",
          champagne: "#d4c4a8",
          muted: "#b8a57d",
        },
        rosegold: {
          DEFAULT: "#b76e79",
          soft: "#c9959e",
        },
        pearl: {
          DEFAULT: "#f0ebe5",
          gray: "#e8e4df",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "var(--font-serif-cn)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "var(--font-sans-cn)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gold-rose": "linear-gradient(135deg, #c9a962 0%, #b76e79 55%, #c9a962 100%)",
        "subtle-radial":
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(201, 169, 98, 0.12), transparent)",
      },
      boxShadow: {
        luxury: "0 24px 80px rgba(0, 0, 0, 0.55), 0 0 1px rgba(201, 169, 98, 0.15)",
        card: "0 8px 32px rgba(0, 0, 0, 0.4)",
      },
      animation: {
        "fade-up": "fadeUp 0.8s ease-out forwards",
        shimmer: "shimmer 8s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
