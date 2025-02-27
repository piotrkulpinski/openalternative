"use client"

import { HoverCard as HoverCardPrimitive } from "radix-ui"
import type { ComponentProps } from "react"
import { cx, popoverAnimationClasses } from "~/utils/cva"

const HoverCard = HoverCardPrimitive.Root
const HoverCardTrigger = HoverCardPrimitive.Trigger
const HoverCardArrow = HoverCardPrimitive.Arrow

const HoverCardContent = ({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: ComponentProps<typeof HoverCardPrimitive.HoverCardContent>) => {
  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        className={cx(
          "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
          popoverAnimationClasses,
          className,
        )}
        {...props}
      />
    </HoverCardPrimitive.Portal>
  )
}

export { HoverCard, HoverCardTrigger, HoverCardArrow, HoverCardContent }
