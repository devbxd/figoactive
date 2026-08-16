import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Matches the Figo Active app icon's DA: warm dark charcoal-brown
        // background, vivid orange accent, off-white text. Class names
        // (brand-navy, brand-mint, etc.) stay the same across every
        // component so this is the only file that needed to change.
        brand: {
          navy: "#332E27",
          mint: "#FF4A1E",
          black: "#1A1713",
          cream: "#F5F1E7",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
