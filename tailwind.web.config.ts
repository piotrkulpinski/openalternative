import typography from "@tailwindcss/typography"
import type { Config } from "tailwindcss"
import animate from "tailwindcss-animate"
import { fontFamily } from "tailwindcss/defaultTheme"

export default {
  content: [
    "./components/common/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/web/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/*.{js,ts,jsx,tsx,mdx}",
    "./app/(web)/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--color-primary) / <alpha-value>)",
        background: "hsl(var(--color-background) / <alpha-value>)",
        muted: "hsl(var(--color-muted) / <alpha-value>)",
        secondary: "hsl(var(--color-secondary) / <alpha-value>)",
        foreground: "hsl(var(--color-foreground) / <alpha-value>)",
        border: {
          DEFAULT: "hsl(var(--color-border) / <alpha-value>)",
          dark: "hsl(var(--color-border-dark) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--color-card) / <alpha-value>)",
          dark: "hsl(var(--color-card-dark) / <alpha-value>)",
        },
      },
      letterSpacing: {
        micro: "-0.0125em",
      },
      borderColor: {
        DEFAULT: "hsl(var(--color-border))",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
        display: ["var(--font-uncut-sans)", ...fontFamily.sans],
      },
      fontSize: {
        "5xl": ["2.75rem", "1.05"],
      },
      scale: {
        flip: "-1",
      },
      backgroundImage: {
        cross:
          "linear-gradient(-45deg, hsl(var(--color-foreground) /0) 0%, hsl(var(--color-foreground) /0) calc(50% - 0.8px), hsl(var(--color-foreground) /0.66) 50%, hsl(var(--color-foreground) /0) calc(50% + 0.8px), hsl(var(--color-foreground) /0) 100%)",
      },

      keyframes: {
        shimmer: {
          from: { left: "-90%" },
          to: { left: "90%" },
        },

        reveal: {
          from: {
            scale: "0.9",
            opacity: "0",
            transform: "translateY(20px) perspective(250px) rotateX(-15deg)",
          },
          to: {
            scale: "1",
            opacity: "1",
            transform: "translateY(0) perspective(500px) rotateX(0deg)",
          },
        },

        movingBanner: {
          to: {
            backgroundPosition: "100% 0",
          },
        },
      },
      animation: {
        shimmer: "shimmer 1.25s cubic-bezier(0.5, 0.25, 0.25, 0.5) infinite",
        reveal: "reveal linear forwards",
        movingBanner: "movingBanner 25s linear infinite",
      },
    },
  },
  plugins: [typography, animate],
} satisfies Config
