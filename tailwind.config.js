/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // 7-CODE Colors
        code: {
          1: "#FF0000", // Survival/Stability (Red)
          2: "#FF6B00", // Emotion/Relationship (Orange)
          3: "#FFD700", // Will/Self-esteem (Yellow)
          4: "#00FF00", // Love/Compassion (Green)
          5: "#0000FF", // Expression/Communication (Blue)
          6: "#4B0082", // Insight/Intuition (Indigo)
          7: "#8B00FF", // Spirituality/Connection (Violet)
        },
        // Brand Colors
        brand: {
          primary: "#3B82F6", // Trust Blue
          secondary: "#10B981", // Growth Green
          accent: "#8B5CF6", // Wisdom Purple
          dark: "#1E293B", // Slate 800
          light: "#F8FAFC", // Slate 50
        },
      },
      fontFamily: {
        sans: ["Pretendard", "Inter", "ui-sans-serif", "system-ui"],
        display: ["Outfit", "Pretendard", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
