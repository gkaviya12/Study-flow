/** @type {import('tailwindcss').Config} */
export default {
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
        sage: "#C27038",
        "sage-hover": "#A7581B",
        "soft-mint": "#F5EEE6",
        "cream-white": "#FDFBF7",
        forest: "#2A1D17",
        espresso: "#2A1D17",
        amber: {
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#C27038",
        },
        gold: "#D97706",
        "coral-red": "#E05D52",
        "sky-blue": "#5B8FB9",
        slate: "#453932",
        "slate-muted": "#7C6E65",
        "deep-forest": "#15100E",
        "charcoal-sage": "#211A16",
        fog: "#D4C9C1",
        "muted-fog": "#9C8E85",
        border: "#EAE2D7",
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
      keyframes: {
        "bounce-gentle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "bounce-gentle": "bounce-gentle 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
