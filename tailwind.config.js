/**
 * StudyFlow V2 — Tailwind Configuration
 * All brand colors are CSS variables (see src/index.css) so the Light/Dark
 * theme toggle in ThemeContext swaps them instantly without rebuilding.
 */

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Merriweather", "serif"],
      },
      colors: {
        // Aurora Sage brand palette
        sage: "#6FAF8F",
        "sage-hover": "#A8D5BA",
        "soft-mint": "#E8F3EC",
        "cream-white": "#F8FBF9",
        forest: "#2F5D50",
        gold: "#F6C453",
        "coral-red": "#EF6B6B",
        sky-blue: "#60A5FA",
        slate: "#334155",
        "slate-muted": "#64748B",
        deep-forest: "#131C18",
        "charcoal-sage": "#1C2721",
        "fog": "#C7D2CE",
        "muted-fog": "#8CA39B",
        border: "#2B3833",
      },
      borderRadius: {
        button: "14px",
        input: "16px",
        card: "20px",
        avatar: "full",
        modal: "24px",
      },
      boxShadow: {
        card: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)",
      },
    },
  },
  plugins: [],
};