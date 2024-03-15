import designConfig from "@curiousleaf/design/tailwind.config"
import type { Config } from "tailwindcss"

const config = {
  presets: [designConfig],

  content: [
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",

    // Design components inside @curiousleaf scope
    "node_modules/@curiousleaf/design/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: {
          lighter: `var(--color-primary-lighter, ${designConfig.theme.colors.purple.lighter})`,
          light: `var(--color-primary-light, ${designConfig.theme.colors.purple.light})`,
          DEFAULT: `var(--color-primary, ${designConfig.theme.colors.purple.DEFAULT})`,
          dark: `var(--color-primary-dark, ${designConfig.theme.colors.purple.dark})`,
          darker: `var(--color-primary-darker, ${designConfig.theme.colors.purple.darker})`,
        },
      },

      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
} satisfies Config

export default config
