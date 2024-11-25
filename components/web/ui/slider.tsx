import * as SliderPrimitive from "@radix-ui/react-slider"
import type { ComponentProps } from "react"
import { cx } from "~/utils/cva"

const SliderThumb = ({ className, ...props }: ComponentProps<typeof SliderPrimitive.Thumb>) => {
  return (
    <SliderPrimitive.Thumb
      className={cx(
        "block size-3.5 rounded-full border-2 border-primary bg-background ring-2 ring-background transition-colors cursor-pointer",
        "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-inherit focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-default",
        className,
      )}
      {...props}
    />
  )
}

export const Slider = ({ className, ...props }: ComponentProps<typeof SliderPrimitive.Root>) => {
  return (
    <SliderPrimitive.Root
      className={cx("relative flex w-full touch-none select-none items-center", className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-0.5 w-full grow overflow-hidden rounded-full bg-border">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      <SliderThumb />
      <SliderThumb />
    </SliderPrimitive.Root>
  )
}
