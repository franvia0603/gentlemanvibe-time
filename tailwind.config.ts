import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

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
        gv: {
          "true-black": "var(--gv-true-black)",
          "matte-black": "var(--gv-matte-black)",
          charcoal: "var(--gv-charcoal)",
          titanium: "var(--gv-titanium)",
          forest: "var(--gv-forest)",
          beige: "var(--gv-beige)",
          amber: "var(--gv-amber)",
          "amber-glow": "var(--gv-amber-glow)",
          "timer-red": "var(--gv-timer-red)",
          "timer-red-glow": "var(--gv-timer-red-glow)",
          "brand-offwhite": "var(--gv-brand-offwhite)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
export default config;
