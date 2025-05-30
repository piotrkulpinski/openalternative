"use client"

import { Separator as SeparatorPrimitive } from "radix-ui"
import type { ComponentProps } from "react"
import { cx } from "~/utils/cva"

const Separator = ({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: ComponentProps<typeof SeparatorPrimitive.Root>) => {
  return (
    <SeparatorPrimitive.Root
      decorative={decorative}
      orientation={orientation}
      className={cx(
        "shrink-0 self-stretch bg-border",
        orientation === "horizontal" ? "h-px" : "w-px",
        className,
      )}
      {...props}
    />
  )
}

export { Separator }
