"use client"

import { Command as CommandPrimitive } from "cmdk"
import { Slot } from "radix-ui"
import type { ComponentProps, ReactNode } from "react"
import { Dialog, DialogContent, DialogTitle } from "~/components/common/dialog"
import { Icon } from "~/components/common/icon"
import { inputVariants } from "~/components/common/input"
import { Kbd } from "~/components/common/kbd"
import { Stack } from "~/components/common/stack"
import { cx } from "~/utils/cva"

const Command = ({ className, ...props }: ComponentProps<typeof CommandPrimitive>) => {
  return (
    <CommandPrimitive
      className={cx(
        "flex size-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
        className,
      )}
      {...props}
    />
  )
}

type CommandDialogProps = Pick<ComponentProps<typeof Dialog>, "open" | "onOpenChange"> &
  ComponentProps<typeof Command>

const CommandDialog = ({ open, onOpenChange, ...props }: CommandDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className="sr-only">Command Menu</DialogTitle>

      <DialogContent className="overflow-hidden p-0! max-w-sm rounded-md">
        <Command
          className="[&_[cmdk-group]]:p-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground/75 [&_[cmdk-input]]:h-12"
          {...props}
        />
      </DialogContent>
    </Dialog>
  )
}

type CommandInputProps = Omit<ComponentProps<typeof CommandPrimitive.Input>, "prefix"> & {
  prefix?: ReactNode
  suffix?: ReactNode
}

const CommandInput = ({ className, prefix, suffix, ...props }: CommandInputProps) => {
  return (
    <Stack className={cx("px-3 -mb-px border-b", className)}>
      <Slot.Root className="size-4 shrink-0">
        {prefix || <Icon name="lucide/search" className="opacity-50" />}
      </Slot.Root>

      <CommandPrimitive.Input
        className={cx(inputVariants(), "px-0 flex-1 truncate text-sm outline-none")}
        {...props}
      />

      <Slot.Root className="shrink-0">{suffix}</Slot.Root>
    </Stack>
  )
}

const CommandList = ({ className, ...props }: ComponentProps<typeof CommandPrimitive.List>) => {
  return (
    <CommandPrimitive.List
      className={cx("max-h-96 overflow-y-auto overscroll-contain", className)}
      {...props}
    />
  )
}

const CommandEmpty = (props: ComponentProps<typeof CommandPrimitive.Empty>) => {
  return (
    <CommandPrimitive.Empty
      className="py-4 px-3 text-sm text-center text-muted-foreground"
      {...props}
    />
  )
}

const CommandGroup = ({ className, ...props }: ComponentProps<typeof CommandPrimitive.Group>) => {
  return (
    <CommandPrimitive.Group
      className={cx(
        "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
        className,
      )}
      {...props}
    />
  )
}

const CommandSeparator = ({
  className,
  ...props
}: ComponentProps<typeof CommandPrimitive.Separator>) => {
  return <CommandPrimitive.Separator className={cx("-mx-1 h-px bg-border", className)} {...props} />
}

const CommandItem = ({ className, ...props }: ComponentProps<typeof CommandPrimitive.Item>) => {
  return (
    <CommandPrimitive.Item
      className={cx(
        "relative flex items-center gap-2 rounded-sm px-2 py-1.5 scroll-m-2 text-sm select-none cursor-pointer outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled='true']:pointer-events-none data-[disabled='true']:opacity-50",
        className,
      )}
      {...props}
    />
  )
}

const CommandShortcut = ({ className, ...props }: ComponentProps<typeof Kbd>) => {
  return <Kbd className={cx("ml-auto", className)} {...props} />
}

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
}
