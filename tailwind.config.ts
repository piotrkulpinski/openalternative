import type { Config } from "tailwindcss"
import plugin from "tailwindcss/plugin"
import colors from "tailwindcss/colors"
import defaultTheme from "tailwindcss/defaultTheme"

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",

  theme: {
    extend: {
      letterSpacing: {
        micro: "0.0125em",
      },
      borderColor: {
        DEFAULT: colors.neutral["200"],
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      gridColumns: {
        DEFAULT: "16rem",
        xxs: "10rem",
        xs: "12rem",
        sm: "14rem",
        md: "16rem",
        lg: "18rem",
        xl: "20rem",
      },

      keyframes: {
        shimmer: {
          from: { left: "-90%" },
          to: { left: "90%" },
        },
      },
      animation: {
        shimmer: "shimmer 1.25s cubic-bezier(0.5, 0.25, 0.25, 0.5) infinite",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
    require("tailwindcss-animate"),
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          "grid-auto-fill": (value) => ({
            gridTemplateColumns: `repeat(auto-fill, minmax(${value}, 1fr))`,
          }),
          "grid-auto-fit": (value) => ({
            gridTemplateColumns: `repeat(auto-fit, minmax(${value}, 1fr))`,
          }),
        },
        { values: theme("gridColumns") }
      )
    }),
  ],
} satisfies Config
