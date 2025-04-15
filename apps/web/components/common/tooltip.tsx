"use client"

import { Tooltip as TooltipPrimitive } from "radix-ui"
import type { ComponentProps, ReactNode } from "react"
import { cx } from "~/utils/cva"

const TooltipProvider = TooltipPrimitive.Provider
const TooltipRoot = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger
const TooltipPortal = TooltipPrimitive.Portal
const TooltipArrow = TooltipPrimitive.Arrow

const TooltipContent = ({
  className,
  sideOffset = 4,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Content>) => {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        sideOffset={sideOffset}
        className={cx(
          "z-50 max-w-60 inline-flex items-center gap-2 px-3 py-1.5 bg-foreground text-xs text-background text-center text-pretty rounded-md will-change-[transform,opacity]",
          className,
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  )
}

type TooltipProps = ComponentProps<typeof TooltipPrimitive.Root> &
  ComponentProps<typeof TooltipContent> & {
    tooltip: ReactNode
  }

const TooltipBase = ({ children, className, delayDuration, tooltip, ...rest }: TooltipProps) => {
  if (!tooltip) {
    return children
  }

  return (
    <TooltipRoot delayDuration={delayDuration}>
      <TooltipTrigger className={className} asChild>
        {children}
      </TooltipTrigger>

      <TooltipPortal>
        <TooltipContent {...rest}>
          {tooltip}
          <TooltipArrow className="fill-foreground" />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  )
}

const Tooltip = Object.assign(TooltipBase, {
  Provider: TooltipProvider,
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Portal: TooltipPortal,
  Content: TooltipContent,
  Arrow: TooltipArrow,
})

export { Tooltip, TooltipRoot, TooltipTrigger, TooltipContent, TooltipProvider }
