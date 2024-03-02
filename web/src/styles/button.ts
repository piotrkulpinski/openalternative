import { cva } from "cva"

export const buttonVariants = cva({
  base: [
    "relative inline-flex items-center justify-center gap-[1ch] py-2 px-4 border font-medium text-sm leading-icon rounded-md shadow-sm hover:z-10",
    "disabled:opacity-60 disabled:pointer-events-none",
  ],

  variants: {
    theme: {
      primary: "bg-gray-800 border-transparent text-white hover:bg-gray-900",
      secondary: "bg-white hover:bg-gray-100",
    },
  },

  defaultVariants: {
    theme: "primary",
  },
})
