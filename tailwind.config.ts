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
        // Crimson — the primary brand accent.
        brand: {
          50: "#FDF2F3",
          100: "#FBE3E6",
          200: "#F5C2C9",
          300: "#EC919D",
          400: "#DE5468",
          500: "#D32740",
          600: "#C8102E", // solid buttons, links
          700: "#AB0C27", // hover
          800: "#8C0A20",
          900: "#6E0819",
          DEFAULT: "#C8102E",
        },
        // Golden yellow — secondary CTA (always with dark text on it).
        gold: {
          50: "#FEFAE8",
          100: "#FDF3C4",
          200: "#FBE88C",
          300: "#F8DA4B",
          400: "#F5C518",
          500: "#E8B30C",
          600: "#C9960A",
          DEFAULT: "#F5C518",
        },
        ink: {
          DEFAULT: "#1A1A1A",
          muted: "#52525B",
          subtle: "#70707A",
        },
        /*
         * Deep burgundy for the dark bands — footer, CTA panels, mega-menu
         * feature cards. Flat near-black read as a grey hole against the cream
         * page; these carry the crimson, so dark sections stay on-brand.
         */
        depth: {
          DEFAULT: "#3B0F1C",
          soft: "#4E1426", // raised cards sitting on DEFAULT
          deep: "#280913", // gradient foot, hairlines
          line: "#5C2434", // dividers inside a dark band
          text: "#D9C2C8", // body copy on DEFAULT
          dim: "#A8858F", // captions and meta on DEFAULT
        },
        /*
         * Pure white page with neutral near-white supporting surfaces — these
         * must stay distinguishable from the page or bands, cards and input
         * wells all collapse into it. Mirrors the CSS vars in globals.css.
         */
        surface: {
          DEFAULT: "#FFFFFF", // page background
          alt: "#FAFAFA", // alternating band
          card: "#F7F7F8", // card fill
          sunken: "#F1F1F4", // tab tracks, input wells
        },
        hairline: {
          DEFAULT: "#E7E7EA",
          strong: "#D4D4D9",
        },
        accent: "var(--brand, #C8102E)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        // Display face for headings.
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(26, 26, 26, 0.04)",
        lift: "0 18px 40px -18px rgba(26, 26, 26, 0.16)",
        brand: "0 12px 32px -16px rgba(200, 16, 46, 0.3)",
      },
      borderRadius: {
        card: "0.75rem",
      },
      maxWidth: {
        shell: "80rem",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
