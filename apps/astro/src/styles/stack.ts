import { cva } from "cva"

export const stackVariants = cva({
  base: "flex",

  variants: {
    size: {
      xs: "gap-x-1 gap-y-0.5",
      sm: "gap-x-2 gap-y-1",
      md: "gap-x-3 gap-y-2",
      lg: "gap-x-4 gap-y-3",
    },
    direction: {
      row: "flex-row flex-wrap items-center place-content-start",
      column: "flex-col items-start",
    },
  },

  defaultVariants: {
    size: "md",
    direction: "row",
  },
})
