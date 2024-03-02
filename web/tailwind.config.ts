import type { Config } from "tailwindcss"
import colors from "tailwindcss/colors"
import defaultTheme from "tailwindcss/defaultTheme"
import plugin from "tailwindcss/plugin"

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],

  theme: {
    extend: {
      colors: {
        black: "#0E1216",
        gray: colors.zinc,
      },

      fontFamily: {
        sans: ["Inter Variable", ...defaultTheme.fontFamily.sans],
      },
    },
  },

  plugins: [
    require("@tailwindcss/typography"),
    plugin(({ addComponents }) => {
      addComponents({
        "a, button": {
          transition: "all 0.15s ease-out",
          cursor: "pointer",
        },
        strong: {
          fontWeight: "600",
        },
      })
    }),
  ],
} satisfies Config
