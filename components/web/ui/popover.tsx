import * as PopoverPrimitive from "@radix-ui/react-popover"
import { XIcon } from "lucide-react"
import type { ComponentPropsWithoutRef, ElementRef, ReactNode } from "react"
import { forwardRef } from "react"
import { type VariantProps, cva, cx } from "~/utils/cva"

const popoverVariants = cva({
  base: [
    "z-50 p-2 min-w-[8rem] rounded-md bg-background border shadow-md text-foreground text-xs outline-none shadow-[hsl(var(--color-foreground)/_10%)_0px_10px_38px_-10px,_hsl(var(--color-foreground)/_15%)_0px_10px_20px_-15px] will-change-[transform,opacity]",
    "animate-in fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  ],
})

const popoverArrowVariants = cva({
  base: "w-2 h-1 block fill-background drop-shadow-sm",
})

const popoverCloseVariants = cva({
  base: [
    "absolute right-4 top-4 rounded p-px opacity-50 outline-none transition-opacity hover:opacity-75",
  ],
})

export type PopoverElement = ElementRef<typeof PopoverPrimitive.Trigger>
export type PopoverProps = Omit<ComponentPropsWithoutRef<typeof PopoverContent>, "popover"> & {
  /**
   * The content to display in the popover.
   */
  popover: ReactNode

  /**
   * If set to `true`, the close button will be displayed in the popover.
   */
  closeable?: boolean
}

export const PopoverRoot = PopoverPrimitive.Root
export const PopoverTrigger = PopoverPrimitive.Trigger
export const PopoverPortal = PopoverPrimitive.Portal
export const PopoverAnchor = PopoverPrimitive.Anchor

export const PopoverContent = forwardRef<
  ElementRef<typeof PopoverPrimitive.Content>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & VariantProps<typeof popoverVariants>
>(({ children, className, ...props }, ref) => (
  <PopoverPrimitive.Content ref={ref} className={cx(popoverVariants({ className }))} {...props}>
    {children}
    <PopoverArrow />
  </PopoverPrimitive.Content>
))

export const PopoverArrow = forwardRef<
  ElementRef<typeof PopoverPrimitive.Arrow>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Arrow> &
    VariantProps<typeof popoverArrowVariants>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Arrow
    ref={ref}
    className={cx(popoverArrowVariants({ className }))}
    {...props}
  />
))

export const PopoverClose = forwardRef<
  ElementRef<typeof PopoverPrimitive.Close>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Close> &
    VariantProps<typeof popoverCloseVariants>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Close ref={ref} className={cx(popoverCloseVariants({ className }))} {...props}>
    <XIcon />
  </PopoverPrimitive.Close>
))

export const PopoverBase = forwardRef<PopoverElement, PopoverProps>((props, ref) => {
  const { children, popover, closeable = false, ...rest } = props

  if (!popover) {
    return children
  }

  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger ref={ref} asChild>
        {children}
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverContent {...rest}>
          {closeable && <PopoverClose />}
          {popover}
        </PopoverContent>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
})

export const Popover = Object.assign(PopoverBase, {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Portal: PopoverPortal,
  Anchor: PopoverAnchor,
  Content: PopoverContent,
  Arrow: PopoverArrow,
  Close: PopoverClose,
})

Popover.defaultProps = {
  align: "center",
  side: "bottom",
  collisionPadding: 5,
  sideOffset: 4,
}
