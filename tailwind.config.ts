import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Bold black + electric volt accent — a deliberate move away from
        // the softer navy/teal of the client's old Shopify theme, per their
        // "make it different, make it wow" request. Class names (brand-navy,
        // brand-mint, etc.) stay the same across every component; only the
        // hex values changed here.
        brand: {
          navy: "#131313",
          mint: "#D6FF3F",
          black: "#000000",
          cream: "#F3F2ED",
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
