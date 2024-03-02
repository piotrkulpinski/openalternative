import { cva } from "cva"

export const listVariants = cva({
  base: "flex",

  variants: {
    size: {
      sm: "gap-2",
      md: "gap-x-3 gap-y-2",
      lg: "gap-x-4 gap-y-3",
    },
    direction: {
      row: "flex-row flex-wrap items-center",
      column: "flex-col items-start",
    },
  },

  defaultVariants: {
    size: "md",
    direction: "row",
  },
})
