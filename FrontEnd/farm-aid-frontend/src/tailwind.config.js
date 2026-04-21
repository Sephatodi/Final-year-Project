module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#2D6A4F",
        accent: "#D4A373",
        "background-light": "#F8F9FA",
        "background-dark": "#121212",
        sage: {
          50: "#f2f7f3",
          100: "#e5ede7",
          200: "#c7d8cb",
          300: "#a9c3af",
          400: "#6e9b77",
          500: "#4c9a66",
          600: "#3d7b52",
          700: "#2d5c3d",
          800: "#1e3e29",
          900: "#0f1f14",
        },
      },
      fontFamily: {
        display: ["Outfit", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
        full: "9999px",
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
};
