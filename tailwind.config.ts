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
        // rgb(var(--x-rgb) / <alpha-value>) 형태로 연결해야 bg-gv-charcoal/70
        // 같은 Tailwind opacity modifier가 실제로 동작한다 (CSS 변수가
        // hex 문자열이면 modifier가 조용히 무효화되어 완전 투명해진다).
        gv: {
          "true-black": "rgb(var(--gv-true-black-rgb) / <alpha-value>)",
          "matte-black": "rgb(var(--gv-matte-black-rgb) / <alpha-value>)",
          charcoal: "rgb(var(--gv-charcoal-rgb) / <alpha-value>)",
          titanium: "rgb(var(--gv-titanium-rgb) / <alpha-value>)",
          forest: "rgb(var(--gv-forest-rgb) / <alpha-value>)",
          beige: "rgb(var(--gv-beige-rgb) / <alpha-value>)",
          amber: "rgb(var(--gv-amber-rgb) / <alpha-value>)",
          "amber-glow": "rgb(var(--gv-amber-glow-rgb) / <alpha-value>)",
          "timer-red": "rgb(var(--gv-timer-red-rgb) / <alpha-value>)",
          "timer-red-glow":
            "rgb(var(--gv-timer-red-glow-rgb) / <alpha-value>)",
          "brand-offwhite":
            "rgb(var(--gv-brand-offwhite-rgb) / <alpha-value>)",
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
