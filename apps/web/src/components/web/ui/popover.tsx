import * as PopoverPrimitive from "@radix-ui/react-popover"
import { XIcon } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"
import { type VariantProps, cva, cx } from "~/utils/cva"

const popoverVariants = cva({
  base: [
    "z-50 p-2 min-w-[8rem] rounded-md bg-background border shadow-md text-foreground text-xs outline-hidden shadow-[hsl(var(--color-foreground)/_10%)_0px_10px_38px_-10px,_hsl(var(--color-foreground)/_15%)_0px_10px_20px_-15px] will-change-[transform,opacity]",
    "animate-in fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  ],
})

const popoverArrowVariants = cva({
  base: "w-2 h-1 block fill-background drop-shadow-xs",
})

const popoverCloseVariants = cva({
  base: [
    "absolute right-4 top-4 rounded-sm p-px opacity-50 outline-hidden transition-opacity hover:opacity-75",
  ],
})

type PopoverProps = Omit<ComponentProps<typeof PopoverContent>, "popover"> & {
  popover: ReactNode
  closeable?: boolean
}

const PopoverRoot = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger
const PopoverPortal = PopoverPrimitive.Portal
const PopoverAnchor = PopoverPrimitive.Anchor

const PopoverContent = ({
  children,
  className,
  ...props
}: ComponentProps<typeof PopoverPrimitive.Content> & VariantProps<typeof popoverVariants>) => {
  return (
    <PopoverPrimitive.Content className={cx(popoverVariants({ className }))} {...props}>
      {children}
      <PopoverArrow />
    </PopoverPrimitive.Content>
  )
}

const PopoverArrow = ({
  className,
  ...props
}: ComponentProps<typeof PopoverPrimitive.Arrow> & VariantProps<typeof popoverArrowVariants>) => {
  return <PopoverPrimitive.Arrow className={cx(popoverArrowVariants({ className }))} {...props} />
}

const PopoverClose = ({
  className,
  ...props
}: ComponentProps<typeof PopoverPrimitive.Close> & VariantProps<typeof popoverCloseVariants>) => {
  return (
    <PopoverPrimitive.Close className={cx(popoverCloseVariants({ className }))} {...props}>
      <XIcon />
    </PopoverPrimitive.Close>
  )
}

const PopoverBase = ({ children, popover, closeable = false, ...rest }: PopoverProps) => {
  if (!popover) {
    return children
  }

  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>{children}</PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverContent {...rest}>
          {closeable && <PopoverClose />}
          {popover}
        </PopoverContent>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

const Popover = Object.assign(PopoverBase, {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Portal: PopoverPortal,
  Anchor: PopoverAnchor,
  Content: PopoverContent,
  Arrow: PopoverArrow,
  Close: PopoverClose,
})

export {
  Popover,
  PopoverRoot,
  PopoverTrigger,
  PopoverPortal,
  PopoverAnchor,
  PopoverContent,
  PopoverArrow,
  PopoverClose,
  type PopoverProps,
}
