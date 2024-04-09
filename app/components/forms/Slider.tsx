import * as SliderPrimitive from "@radix-ui/react-slider"
import { cx } from "cva"
import { forwardRef, ElementRef, ComponentPropsWithoutRef } from "react"

const SliderThumb = forwardRef<
  ElementRef<typeof SliderPrimitive.Thumb>,
  ComponentPropsWithoutRef<typeof SliderPrimitive.Thumb>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Thumb
    ref={ref}
    className={cx(
      "block size-3.5 rounded-full border-2 border-pink-600 bg-white ring-4 ring-white transition-colors cursor-pointer",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inherit focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-default",
      className
    )}
    {...props}
  />
))
SliderThumb.displayName = SliderPrimitive.Thumb.displayName

export const Slider = forwardRef<
  ElementRef<typeof SliderPrimitive.Root>,
  ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cx("relative flex w-full touch-none select-none items-center", className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-0.5 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-pink-600" />
    </SliderPrimitive.Track>
    <SliderThumb />
    <SliderThumb />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName
