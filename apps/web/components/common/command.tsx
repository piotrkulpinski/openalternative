"use client"

import { Command as CommandPrimitive } from "cmdk"
import type {} from "radix-ui"
import type { ComponentProps } from "react"
import { Dialog, DialogContent, DialogTitle } from "~/components/common/dialog"
import { Kbd } from "~/components/common/kbd"
import { ScrollArea } from "~/components/common/scroll-area"
import { cx } from "~/utils/cva"
import { Icon } from "./icon"

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

const CommandDialog = ({ children, ...props }: ComponentProps<typeof Dialog>) => {
  return (
    <Dialog {...props}>
      <DialogTitle className="sr-only">Command Menu</DialogTitle>
      <DialogContent className="overflow-hidden !p-0 max-w-sm rounded-md">
        <Command className="[&_[cmdk-group]]:p-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground/75 [&_[cmdk-input]]:h-12">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

const CommandInput = ({ className, ...props }: ComponentProps<typeof CommandPrimitive.Input>) => {
  return (
    <div className="flex items-center gap-2 border-b px-3" cmdk-input-wrapper="">
      <Icon name="lucide/search" className="size-4 shrink-0 opacity-50" />
      <CommandPrimitive.Input
        className={cx(
          "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    </div>
  )
}

const CommandList = ({ className, ...props }: ComponentProps<typeof CommandPrimitive.List>) => {
  return (
    <ScrollArea>
      <CommandPrimitive.List className={cx("max-h-72", className)} {...props} />
    </ScrollArea>
  )
}

const CommandEmpty = (props: ComponentProps<typeof CommandPrimitive.Empty>) => {
  return <CommandPrimitive.Empty className="py-6 text-center text-sm" {...props} />
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
        "relative flex cursor-pointer select-none items-center gap-1 rounded-sm px-2 py-1.5 scroll-m-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled='true']:pointer-events-none data-[disabled='true']:opacity-50",
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
