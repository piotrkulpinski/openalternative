import { cva } from "~/utils/cva"

export const cardSimpleVariants = cva({
  base: "group flex justify-between items-center gap-4 min-w-0 -my-1 py-1",
})

export const cardSimpleTitleVariants = cva({
  base: "truncate",
})

export const cardSimpleDividerVariants = cva({
  base: "min-w-2 flex-1 group-hover:opacity-35",
})

export const cardSimpleCaptionVariants = cva({
  base: "shrink-0 text-xs text-secondary",
})
