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
        "peer size-4 shrink-0 border-foreground/50! rounded-md shadow disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="grid place-items-center">
        <Icon name="lucide/check" className="size-3" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  </Box>
)

export { Checkbox }
