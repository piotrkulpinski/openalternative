import { Slot } from "@radix-ui/react-slot"
import type { HTMLAttributes } from "react"
import { forwardRef } from "react"

import { type VariantProps, cva, cx } from "~/utils/cva"

export const boxVariants = cva({
  base: "border",

  variants: {
    hover: {
      true: "hover:ring-[3px] hover:ring-border/40 hover:border-border-dark",
    },
    focus: {
      true: "focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-border/40 focus-visible:border-border focus-visible:z-10",
    },
    focusWithin: {
      true: "focus-within:outline-none focus-within:ring-[3px] focus-within:ring-border/40 focus-within:border-border-dark focus-within:z-10",
    },
  },
})

export type BoxProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof boxVariants>

export const Box = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
  const { hover, focus, focusWithin, className, ...rest } = props

  return (
    <Slot
      ref={ref}
      className={cx(boxVariants({ hover, focus, focusWithin, className }))}
      {...rest}
    />
  )
})

Box.displayName = "Box"
