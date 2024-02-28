/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],

  theme: {
    fontSize: {
      "3xs": ["clamp(0.688rem, 0.688rem + 0vw, 0.688rem)", "1.25"], // 11px
      "2xs": ["clamp(0.688rem, 0.663rem + 0.096vw, 0.75rem)", "1.33"], // 12px
      xs: ["clamp(0.75rem, 0.726rem + 0.096vw, 0.813rem)", "1.4"], // 13px
      sm: ["clamp(0.813rem, 0.788rem + 0.096vw, 0.875rem)", "1.5"], // 14px
      base: ["clamp(0.875rem, 0.827rem + 0.192vw, 1rem)", "1.6"], // 16px
      lg: ["clamp(1.05rem, 0.992rem + 0.231vw, 1.2rem)", "1.5"], // 19.2px
      xl: ["clamp(1.26rem, 1.191rem + 0.277vw, 1.44rem)", "1.4"], // 23.04px
      "2xl": ["clamp(1.512rem, 1.429rem + 0.332vw, 1.728rem)", "1.33"], // 27.684px
      "3xl": ["clamp(1.814rem, 1.714rem + 0.4vw, 2.074rem)", "1.25"], // 33.177px
      "4xl": ["clamp(2.177rem, 2.057rem + 0.478vw, 2.488rem)", "1.2"], // 39.813px
      "5xl": ["clamp(2.613rem, 2.47rem + 0.574vw, 2.986rem)", "1.167"], // 47.77px
    },
    letterSpacing: {
      normal: "0",
      0.5: "0.005em",
      1: "0.01em",
      1.5: "0.015em",
      2: "0.02em",
      4: "0.04em",
      6: "0.06em",
    },

    extend: {},
  },
  plugins: [],
}
