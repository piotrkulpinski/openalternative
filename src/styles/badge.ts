import { cva } from "cva"

export const badgeVariants = cva({
  base: [
    "relative inline-flex items-center justify-center px-[0.6em] py-[0.125em]",
    "font-medium break-normal whitespace-nowrap bg-white border text-center leading-icon",
  ],

  variants: {
    theme: {
      blue: "border-blue-700/20 text-blue-700",
      orange: "border-orange-700/20 text-orange-700",
      yellow: "border-yellow-700/20 text-yellow-700",
      red: "border-red-700/20 text-red-700",
      green: "border-green-700/20 text-green-700",
      purple: "border-purple-700/20 text-purple-700",
      pink: "border-fuchsia-700/20 text-fuchsia-700",
      teal: "border-teal-700/20 text-teal-700",
      gray: "bg-zinc-50 text-gray-600",
    },
    size: {
      sm: "gap-[0.4ch] text-3xs",
      md: "gap-[0.5ch] text-2xs",
      lg: "gap-[0.6ch] text-xs",
    },
    shape: {
      rounded: "rounded",
      pill: "rounded-full",
    },
  },

  defaultVariants: {
    theme: "gray",
    size: "md",
    shape: "rounded",
  },
})
