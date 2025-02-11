import { defineConfig } from "cva"
import { extendTailwindMerge } from "tailwind-merge"

const customTwMerge = extendTailwindMerge({})

export const { cva, cx, compose } = defineConfig({
  hooks: {
    onComplete: className => customTwMerge(className),
  },
})

export const popoverAnimationClasses = [
  "data-[state=open]:animate-in data-[state=closed]:animate-out",
  "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
  "data-[state=open]:slide-in-from-bottom-2 data-[state=closed]:slide-out-to-bottom-2",
]

export type { VariantProps } from "cva"
