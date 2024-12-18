import { cva } from "~/utils/cva"

export const buttonVariants = cva({
  base: [
    "group/button relative inline-flex items-center justify-center border font-medium text-[0.8125rem] text-start leading-tight rounded-md hover:z-10",
    "disabled:opacity-60 disabled:pointer-events-none",
  ],

  variants: {
    variant: {
      fancy: "border-transparent! bg-primary text-white hover:opacity-90",
      primary: "border-transparent! text-background bg-foreground hover:opacity-90",
      secondary: "bg-background text-secondary hover:bg-card hover:border-border-dark",
      ghost: "border-transparent! text-foreground hover:bg-card-dark",
    },
    size: {
      sm: "gap-[0.66ch] py-1 px-2 leading-none",
      md: "gap-[0.75ch] py-1.5 px-3",
      lg: "gap-[1ch] py-2 px-4 sm:text-sm",
    },
    isAffixOnly: {
      true: "",
    },
    isPending: {
      true: "[&>*:not(.animate-spin)]:text-transparent select-none",
    },
  },

  compoundVariants: [
    // Is affix only
    { size: "sm", isAffixOnly: true, class: "px-1" },
    { size: "md", isAffixOnly: true, class: "px-1.5" },
    { size: "lg", isAffixOnly: true, class: "px-2" },
  ],

  defaultVariants: {
    variant: "primary",
    size: "lg",
  },
})

export const buttonAffixVariants = cva({
  base: "shrink-0 size-[1.1em]",
})
