import { cva } from "~/utils/cva"

export const navLinkVariants = cva({
  base: [
    "group flex items-center gap-2 p-0.5 -m-0.5 text-sm cursor-pointer",
    "text-muted hover:text-foreground",
  ],
  variants: {
    isActive: {
      true: "font-medium text-foreground",
    },
  },
})
