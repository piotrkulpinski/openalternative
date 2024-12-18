import { Slot } from "@radix-ui/react-slot"
import type { ComponentProps } from "react"

import { type VariantProps, cva, cx } from "~/utils/cva"

const boxVariants = cva({
  base: "border",

  variants: {
    hover: {
      true: "cursor-pointer hover:ring-[3px] hover:ring-border/40 hover:border-border-dark",
    },
    focus: {
      true: "focus-visible:outline-hidden focus-visible:ring-[3px] focus-visible:ring-border/40 focus-visible:border-border-dark",
    },
    focusWithin: {
      true: "focus-within:outline-hidden focus-within:ring-[3px] focus-within:ring-border/40 focus-within:border-border-dark",
    },
  },
})

type BoxProps = ComponentProps<"div"> & VariantProps<typeof boxVariants>

const Box = ({ hover, focus, focusWithin, className, ...props }: BoxProps) => {
  return <Slot className={cx(boxVariants({ hover, focus, focusWithin, className }))} {...props} />
}

export { Box, boxVariants, type BoxProps }
