import type { Config } from "tailwindcss";

/*
 * One solid red for every accent and action, midnight navy for the dark
 * bands. No multi-colour gradients. Amber is kept only for rating stars.
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // Brand crimson #BF0123 at 600; lighter/darker steps mixed toward white/black.
          50: "#FCF2F4",
          100: "#F9E6E9",
          200: "#F1C7CF",
          300: "#E599A7",
          400: "#D55A70",
          500: "#C92744",
          600: "#BF0123",
          700: "#A2011E",
          800: "#860119",
          900: "#690113",
          DEFAULT: "#BF0123",
        },
        // Sunset amber — secondary CTA, always with dark text on it.
        gold: {
          50: "#FFF8EB",
          100: "#FFEDC7",
          200: "#FFDA8A",
          300: "#FFC34D",
          400: "#FFAE22",
          500: "#F59700",
          600: "#D47B00",
          DEFAULT: "#FFAE22",
        },
        violet: {
          300: "#C9A2FF",
          400: "#A970FF",
          500: "#8B3DF7",
          600: "#7424E0",
          DEFAULT: "#8B3DF7",
        },
        // Midnight navy from the "Trip" wordmark — dark bands, hero, footer.
        night: {
          950: "#0C0C0E",
          900: "#141416",
          800: "#1C1C1F",
          700: "#27272A",
          600: "#3F3F46",
          line: "rgba(255,255,255,0.09)",
          text: "#D4D4D8",
          dim: "#A1A1AA",
          DEFAULT: "#141416",
        },
        ink: {
          DEFAULT: "#141416",
          muted: "#52525B",
          subtle: "#71717A",
        },
        // Kept for older references; mirrors the night scale.
        depth: {
          DEFAULT: "#141416",
          soft: "#1C1C1F",
          deep: "#0C0C0E",
          line: "#3F3F46",
          text: "#D4D4D8",
          dim: "#A1A1AA",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          alt: "#F7F7F8",
          card: "#F4F4F5",
          sunken: "#EDEDEF",
        },
        hairline: {
          DEFAULT: "#E7E7EA",
          strong: "#D4D4D8",
        },
        accent: "var(--brand, #BF0123)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
        // Old name for the heading face; now the same geometric display font.
        serif: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(20, 20, 22, 0.05)",
        lift: "0 24px 48px -20px rgba(20, 20, 22, 0.22)",
        brand: "0 14px 34px -14px rgba(191, 1, 35, 0.5)",
        glow: "0 0 0 1px rgba(255,255,255,0.06), 0 30px 70px -24px rgba(12, 12, 14, 0.55)",
      },
      borderRadius: {
        card: "1rem",
        "4xl": "2rem",
      },
      maxWidth: {
        shell: "80rem",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "gradient-pan": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "dash-run": {
          to: { strokeDashoffset: "-200" },
        },
        "pulse-dot": {
          "0%": { boxShadow: "0 0 0 0 rgba(52, 211, 153, 0.6)" },
          "70%": { boxShadow: "0 0 0 10px rgba(52, 211, 153, 0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(52, 211, 153, 0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
        marquee: "marquee 40s linear infinite",
        "marquee-slow": "marquee 70s linear infinite",
        float: "float 6s ease-in-out infinite",
        "float-delay": "float 7s ease-in-out 1.5s infinite",
        "gradient-pan": "gradient-pan 8s ease infinite",
        "dash-run": "dash-run 6s linear infinite",
        "pulse-dot": "pulse-dot 2s infinite",
      },
    },
  },
  plugins: [],
};
export default config;
