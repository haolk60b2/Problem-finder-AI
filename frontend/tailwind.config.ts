import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"]
      },
      colors: {
        canvas: "#f5efe6",
        ink: "#102217",
        ember: "#d76631",
        moss: "#274f3c",
        gold: "#c6922d",
        paper: "#fffaf2",
        mist: "#e4dbc8"
      },
      boxShadow: {
        card: "0 24px 70px rgba(16, 34, 23, 0.12)"
      },
      borderRadius: {
        "4xl": "2rem"
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top left, rgba(215, 102, 49, 0.18), transparent 28%), radial-gradient(circle at 80% 15%, rgba(198, 146, 45, 0.22), transparent 24%), linear-gradient(180deg, rgba(255,250,242,0.96), rgba(245,239,230,0.88))"
      }
    }
  },
  plugins: []
};

export default config;
