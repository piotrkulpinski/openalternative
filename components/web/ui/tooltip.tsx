import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import type { ComponentProps, ReactNode } from "react"
import { type VariantProps, cva, cx } from "~/utils/cva"

const tooltipVariants = cva({
  base: [
    "z-50 px-2.5 py-1 min-h-6 max-w-[12rem] inline-flex items-center gap-2 rounded-md bg-background text-xs/tight text-pretty font-medium invert pointer-events-none outline-hidden select-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity]",
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

type TooltipProps = ComponentProps<typeof TooltipPrimitive.Root> &
  ComponentProps<typeof TooltipContent> & {
    tooltip: ReactNode
  }

const TooltipProvider = TooltipPrimitive.Provider
const TooltipRoot = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger
const TooltipPortal = TooltipPrimitive.Portal

const TooltipContent = ({
  children,
  className,
  align = "center",
  collisionPadding = 5,
  sideOffset = 4,
  ...rest
}: ComponentProps<typeof TooltipPrimitive.Content> & VariantProps<typeof tooltipVariants>) => {
  return (
    <TooltipPrimitive.Content
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
}

const TooltipArrow = ({
  className,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Arrow> & VariantProps<typeof tooltipArrowVariants>) => {
  return <TooltipPrimitive.Arrow className={cx(tooltipArrowVariants({ className }))} {...props} />
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
        <TooltipContent {...rest}>{tooltip}</TooltipContent>
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

export {
  Tooltip,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipPortal,
  TooltipContent,
  TooltipArrow,
  type TooltipProps,
}
