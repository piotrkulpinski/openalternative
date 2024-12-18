import { cva } from "~/utils/cva"

export const boxVariants = cva({
  base: "border",

  variants: {
    hover: {
      true: "cursor-pointer hover:ring-[3px] hover:ring-border/40 hover:border-border-dark",
    },
    focus: {
      true: "focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-border/40 focus-visible:border-border-dark",
    },
    focusWithin: {
      true: "focus-within:outline-hidden focus-within:ring-[3px] focus-within:ring-border/40 focus-within:border-border-dark",
    },
  },
})
