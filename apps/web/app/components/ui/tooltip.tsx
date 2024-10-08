import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import type { ComponentPropsWithoutRef, ElementRef, ReactNode } from "react"
import { forwardRef } from "react"
import { type VariantProps, cva, cx } from "~/utils/cva"

const tooltipVariants = cva({
  base: [
    "z-50 px-2.5 py-1 min-h-6 max-w-[12rem] inline-flex items-center gap-2 rounded-md bg-background text-xs/tight text-pretty font-medium invert pointer-events-none outline-none select-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]",
    "animate-in fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  ],

  variants: {
    align: {
      start: "text-start",
      center: "text-center",
      end: "text-end",
    },
  },

  defaultVariants: {
    align: "center",
  },
})

const tooltipArrowVariants = cva({
  base: "w-2 h-1 block fill-background",
})

export type TooltipElement = ElementRef<typeof TooltipPrimitive.Trigger>
export type TooltipProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Root> &
  ComponentPropsWithoutRef<typeof TooltipContent> & {
    tooltip: ReactNode
  }

export const TooltipProvider = TooltipPrimitive.Provider
export const TooltipRoot = TooltipPrimitive.Root
export const TooltipTrigger = TooltipPrimitive.Trigger
export const TooltipPortal = TooltipPrimitive.Portal

export const TooltipContent = forwardRef<
  ElementRef<typeof TooltipPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & VariantProps<typeof tooltipVariants>
>((props, ref) => {
  const {
    children,
    className,
    align = "center",
    collisionPadding = 5,
    sideOffset = 4,
    ...rest
  } = props

  return (
    <TooltipPrimitive.Content
      ref={ref}
      align={align}
      collisionPadding={collisionPadding}
      sideOffset={sideOffset}
      className={cx(tooltipVariants({ align, className }))}
      {...rest}
    >
      {children}
      <TooltipArrow />
    </TooltipPrimitive.Content>
  )
})
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export const TooltipArrow = forwardRef<
  ElementRef<typeof TooltipPrimitive.Arrow>,
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow> &
    VariantProps<typeof tooltipArrowVariants>
>(({ className, ...props }, ref) => (
  <TooltipPrimitive.Arrow
    ref={ref}
    className={cx(tooltipArrowVariants({ className }))}
    {...props}
  />
))
TooltipArrow.displayName = TooltipPrimitive.Arrow.displayName

export const TooltipBase = forwardRef<TooltipElement, TooltipProps>((props, ref) => {
  const { children, className, delayDuration, tooltip, ...rest } = props

  if (!tooltip) {
    return children
  }

  return (
    <TooltipRoot delayDuration={delayDuration}>
      <TooltipTrigger ref={ref} className={className} asChild>
        {children}
      </TooltipTrigger>

      <TooltipPortal>
        <TooltipContent {...rest}>{tooltip}</TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  )
})
TooltipBase.displayName = "Tooltip"

export const Tooltip = Object.assign(TooltipBase, {
  Provider: TooltipProvider,
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Portal: TooltipPortal,
  Content: TooltipContent,
  Arrow: TooltipArrow,
})
