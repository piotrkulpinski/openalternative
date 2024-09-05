import { defineConfig } from "cva"
import { extendTailwindMerge } from "tailwind-merge"

const customTwMerge = extendTailwindMerge({})

export const { cva, cx, compose } = defineConfig({
  hooks: { onComplete: className => customTwMerge(className) },
})

export type { VariantProps } from "cva"
