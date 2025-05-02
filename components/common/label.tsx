"use client"

import { Label as LabelPrimitive } from "radix-ui"
import type { ComponentProps } from "react"
import { type VariantProps, cva, cx } from "~/utils/cva"

const labelVariants = cva({
  base: "self-start text-sm font-medium text-foreground [&[for]]:cursor-pointer",

  variants: {
    isRequired: {
      true: "after:ml-0.5 after:text-red-600 after:content-['*']",
    },
  },
})

type LabelProps = ComponentProps<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>

const Label = ({ className, isRequired, ...props }: LabelProps) => {
  return (
    <LabelPrimitive.Root
      className={cx(labelVariants({ isRequired, className }))}
      aria-label="Label"
      {...props}
    />
  )
}

export { Label }
