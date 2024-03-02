import { cva } from "cva"

export const badgeVariants = cva({
  base: [
    "relative inline-flex items-center justify-center gap-[0.6ch] px-[0.6em] py-[0.125em]",
    "font-medium break-normal whitespace-nowrap border text-xs text-center leading-icon rounded",
  ],

  variants: {
    theme: {
      blue: "border-blue-700/20 text-blue-800/75",
      orange: "border-orange-700/20 text-orange-800/75",
      yellow: "border-yellow-700/20 text-yellow-800/75",
      red: "border-red-700/20 text-red-800/75",
      green: "border-green-700/20 text-green-800/75",
      purple: "border-purple-700/20 text-purple-800/75",
      pink: "border-fuchsia-700/20 text-fuchsia-800/75",
      teal: "border-teal-700/20 text-teal-800/75",
      gray: "text-gray-600",
    },
  },

  defaultVariants: {
    theme: "gray",
  },
})
