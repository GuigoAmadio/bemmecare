import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "475px",
        "850": "850px",
      },
      colors: {
        background: {
          DEFAULT: "#fefdfb",
          secondary: "#f7f5f2",
          tertiary: "#f0ede8",
        },
        text: {
          primary: "#2d2a24",
          secondary: "#6b6a65",
          muted: "#9a9893",
        },
        primary: {
          DEFAULT: "#6b7c32",
          light: "#8b966c",
          dark: "#4f5a25",
        },
        secondary: {
          DEFAULT: "#a8a39a",
        },
        accent: {
          DEFAULT: "#c4b5a0",
          light: "#d4c7b5",
          dark: "#b5a68f",
        },
        border: {
          DEFAULT: "#e8e4dd",
          light: "#f0ede8",
        },
        success: {
          DEFAULT: "#6b7c32",
        },
        warning: {
          DEFAULT: "#c4b5a0",
        },
        error: {
          DEFAULT: "#b85450",
        },
        info: {
          DEFAULT: "#6b7c32",
        },
      },
      fontFamily: {
        heading: ["var(--font-playfair)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        playfair: ["var(--font-playfair)", "serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        folha1: "url('/fundo/folha1.svg')",
        folha2: "url('/fundo/folha2.svg')",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
        "bounce-in": "bounceIn 0.5s ease-out",
        "gradient-x": "gradient-x 3s ease infinite",
      },
      keyframes: {
        fadeInUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(30px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        slideIn: {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(0)",
          },
        },
        bounceIn: {
          "0%": {
            opacity: "0",
            transform: "scale(0.3)",
          },
          "50%": {
            opacity: "1",
            transform: "scale(1.05)",
          },
          "70%": {
            transform: "scale(0.9)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
        "gradient-x": {
          "0%, 100%": {
            "background-position": "0% 50%",
          },
          "50%": {
            "background-position": "100% 50%",
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
