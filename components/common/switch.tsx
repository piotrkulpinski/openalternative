"use client"

import { Switch as SwitchPrimitive } from "radix-ui"
import type { ComponentProps } from "react"
import { Box } from "~/components/common/box"
import { cx } from "~/utils/cva"

const Switch = ({ className, ...props }: ComponentProps<typeof SwitchPrimitive.Root>) => {
  return (
    <Box focusWithin>
      <SwitchPrimitive.Root
        className={cx(
          "peer inline-flex h-4 w-7 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent! shadow-xs disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
          className,
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb className="pointer-events-none block size-3 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-3 data-[state=unchecked]:translate-x-0" />
      </SwitchPrimitive.Root>
    </Box>
  )
}

export { Switch }
