"use client"

import { RadioGroup as RadioGroupPrimitive } from "radix-ui"
import type { ComponentProps } from "react"
import { cx } from "~/utils/cva"

const RadioGroup = ({ className, ...props }: ComponentProps<typeof RadioGroupPrimitive.Root>) => {
  return <RadioGroupPrimitive.Root className={cx("grid gap-2", className)} {...props} />
}

const RadioGroupItem = ({
  className,
  ...props
}: ComponentProps<typeof RadioGroupPrimitive.Item>) => {
  return (
    <RadioGroupPrimitive.Item
      className={cx(
        "aspect-square size-4 rounded-full border border-ring text-foreground shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <span className="size-2.5 rounded-full bg-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
