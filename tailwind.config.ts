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
          DEFAULT: "var(--color-background)",
          secondary: "var(--color-background-secondary)",
          opposite: "var(--color-background-opposite)",
          weak: "var(--color-background-weak)",
        },
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)",
          strong: "var(--color-text-strong)",
        },
        primary: {
          DEFAULT: "var(--color-primary)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
        },
        muted: {
          DEFAULT: "var(--color-muted)",
        },
        border: {
          DEFAULT: "var(--color-border)",
          strong: "var(--color-border-strong)",
        },
        divider: "var(--color-divider)",
        hover: "var(--color-hover)",
        pressed: "var(--color-pressed)",
        focus: "var(--color-focus)",
        success: {
          DEFAULT: "var(--color-success)",
        },
        warning: {
          DEFAULT: "var(--color-warning)",
        },
        error: {
          DEFAULT: "var(--color-error)",
        },
        info: {
          DEFAULT: "var(--color-info)",
        },
      },
      fontFamily: {
        heading: ["var(--font-playfair)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        playfair: ["var(--font-playfair)", "serif"],
        inter: ["var(--font-inter)", "sans-serif"],
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
