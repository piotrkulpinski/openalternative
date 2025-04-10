"use client"

import { Select as SelectPrimitive } from "radix-ui"
import type { ComponentProps } from "react"
import { Box } from "~/components/common/box"
import { Icon } from "~/components/common/icon"
import { type VariantProps, cx, popoverAnimationClasses } from "~/utils/cva"
import { inputVariants } from "./input"

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

const SelectTrigger = ({
  children,
  className,
  size,
  ...props
}: ComponentProps<typeof SelectPrimitive.Trigger> & VariantProps<typeof inputVariants>) => {
  return (
    <Box hover focus>
      <SelectPrimitive.Trigger
        className={cx(inputVariants({ size }), "flex items-center justify-between", className)}
        {...props}
      >
        {children}
        <SelectPrimitive.Icon asChild>
          <Icon name="lucide/chevrons-up-down" className="ml-1 size-4 opacity-50" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
    </Box>
  )
}

const SelectScrollUpButton = ({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.ScrollUpButton>) => {
  return (
    <SelectPrimitive.ScrollUpButton
      className={cx("flex cursor-pointer items-center justify-center py-1", className)}
      {...props}
    >
      <Icon name="lucide/chevron-up" />
    </SelectPrimitive.ScrollUpButton>
  )
}

const SelectScrollDownButton = ({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.ScrollDownButton>) => {
  return (
    <SelectPrimitive.ScrollDownButton
      className={cx("flex cursor-pointer items-center justify-center py-1", className)}
      {...props}
    >
      <Icon name="lucide/chevron-down" />
    </SelectPrimitive.ScrollDownButton>
  )
}

const SelectContent = ({
  className,
  children,
  position = "popper",
  ...props
}: ComponentProps<typeof SelectPrimitive.Content>) => {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        className={cx(
          "relative z-50 max-h-96 min-w-32 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
          popoverAnimationClasses,
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className,
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cx(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

const SelectLabel = ({ className, ...props }: ComponentProps<typeof SelectPrimitive.Label>) => {
  return (
    <SelectPrimitive.Label
      className={cx("px-2 py-1.5 text-sm font-medium", className)}
      {...props}
    />
  )
}

const SelectItem = ({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Item>) => {
  return (
    <SelectPrimitive.Item
      className={cx(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm text-secondary-foreground outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Icon name="lucide/check" className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

const SelectSeparator = ({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.Separator>) => {
  return (
    <SelectPrimitive.Separator className={cx("-mx-1 my-1 h-px bg-border", className)} {...props} />
  )
}

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
