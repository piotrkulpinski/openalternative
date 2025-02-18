"use client"

import { Popover as PopoverPrimitive } from "radix-ui"
import type { ComponentProps } from "react"
import { cx, popoverAnimationClasses } from "~/utils/cva"

const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger
const PopoverAnchor = PopoverPrimitive.Anchor

const PopoverContent = ({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: ComponentProps<typeof PopoverPrimitive.Content>) => {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        className={cx(
          "z-50 min-w-72 w-[--radix-popper-anchor-width] rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden",
          popoverAnimationClasses,
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
