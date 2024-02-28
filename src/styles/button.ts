import { cva } from "cva"

export const buttonVariants = cva({
  base: [
    "relative inline-flex items-center justify-center border font-medium leading-icon rounded-md shadow-sm hover:z-10",
    "disabled:opacity-60 disabled:pointer-events-none",
  ],

  variants: {
    theme: {
      primary: "bg-gray-800 border-transparent text-white hover:bg-gray-900",
      secondary: "bg-white hover:bg-gray-100",
    },
    size: {
      sm: "text-2xs gap-[0.5ch] py-1 px-2",
      md: "text-xs gap-[0.75ch] py-1.5 px-3",
      lg: "text-sm gap-[1ch] py-2 px-4",
    },
  },

  defaultVariants: {
    theme: "primary",
    size: "lg",
  },
})
