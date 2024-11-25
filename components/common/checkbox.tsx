"use client"

import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"
import type { ComponentProps } from "react"
import { Box } from "~/components/common/box"
import { cx } from "~/utils/cva"

const Checkbox = ({ className, ...props }: ComponentProps<typeof CheckboxPrimitive.Root>) => (
  <Box hover focusWithin>
    <CheckboxPrimitive.Root
      className={cx(
        "peer size-4 shrink-0 rounded-sm disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-card data-[state=checked]:text-foreground",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className={cx("flex items-center justify-center text-current")}>
        <CheckIcon className="size-3" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  </Box>
)

export { Checkbox }
