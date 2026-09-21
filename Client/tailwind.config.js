/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Flat, neutral gray console. No neon/glow accents — status
        // colors are desaturated so they read calmly against gray.
        console: {
          950: "#19191b",
          900: "#1f1f22",
          850: "#242427",
          800: "#2b2b2f",
          700: "#38383d",
          600: "#4a4a51",
          500: "#6e6e76",
          400: "#98989f",
          300: "#c8c8cd",
          200: "#e2e2e5",
        },
        signal: {
          // muted, low-saturation status colors — no bright/neon tones
          info: "#7a8ea0",
          amber: "#ab8a5c",
          red: "#a9615d",
          green: "#748f78",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        panel: "0 0 0 1px rgba(255,255,255,0.04)",
      },
    },
  },
  plugins: [],
};
