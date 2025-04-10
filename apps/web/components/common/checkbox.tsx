"use client"

import { Checkbox as CheckboxPrimitive } from "radix-ui"
import type { ComponentProps } from "react"
import { Box } from "~/components/common/box"
import { Icon } from "~/components/common/icon"
import { cx } from "~/utils/cva"

const Checkbox = ({ className, ...props }: ComponentProps<typeof CheckboxPrimitive.Root>) => (
  <Box focusWithin>
    <CheckboxPrimitive.Root
      className={cx(
        "peer size-4 shrink-0 rounded-sm disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-foreground data-[state=checked]:text-background",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        <Icon name="lucide/check" className="size-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  </Box>
)

export { Checkbox }
