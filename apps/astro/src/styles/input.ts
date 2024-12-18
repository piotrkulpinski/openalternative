import { cva } from "~/utils/cva"

export const inputVariants = cva({
  base: [
    "appearance-none min-h-0 self-stretch bg-background text-secondary font-medium text-[0.8125rem] leading-tight break-words truncate transition duration-150 disabled:text-secondary/50",
    "resize-none field-sizing-content",
  ],

  variants: {
    size: {
      sm: "px-2 py-1 font-normal leading-none rounded-md",
      md: "px-3 py-2 rounded-md",
      lg: "px-4 py-2.5 rounded-lg sm:text-sm",
    },
  },

  defaultVariants: {
    size: "md",
  },
})
