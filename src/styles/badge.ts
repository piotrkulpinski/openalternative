import { cva } from "cva"

export const badgeVariants = cva({
  base: [
    "relative inline-flex items-center justify-center px-[0.6em] py-[0.125em]",
    "font-medium break-normal whitespace-nowrap border text-center leading-icon",
  ],

  variants: {
    theme: {
      blue: "border-blue-500/20 bg-blue-300/5 text-blue-600",
      orange: "border-orange-500/20 bg-orange-300/5 text-orange-600",
      yellow: "border-yellow-500/20 bg-yellow-300/5 text-yellow-600",
      red: "border-red-500/20 bg-red-300/5 text-red-600",
      green: "border-green-500/20 bg-green-300/5 text-green-600",
      purple: "border-purple-500/20 bg-purple-300/5 text-purple-600",
      pink: "border-fuchsia-500/20 bg-fuchsia-300/5 text-fuchsia-600",
      teal: "border-teal-500/20 bg-teal-300/5 text-teal-600",
      gray: "text-gray-600",
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
