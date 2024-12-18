import { cva } from "~/utils/cva"

export const headingVariants = cva({
  base: "font-display font-semibold",

  variants: {
    size: {
      h1: "text-3xl tracking-tight text-pretty bg-linear-to-b from-foreground to-foreground/75 bg-clip-text text-transparent md:text-4xl",
      h2: "text-2xl tracking-tight md:text-3xl",
      h3: "text-2xl tracking-tight",
      h4: "text-xl tracking-tight",
      h5: "text-base font-medium tracking-micro",
      h6: "text-sm font-medium",
    },
  },

  defaultVariants: {
    size: "h3",
  },
})
