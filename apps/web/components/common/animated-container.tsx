"use client"

import { useReducedMotion, useResizeObserver } from "@mantine/hooks"
import { type HTMLMotionProps, motion } from "motion/react"
import { Slot } from "radix-ui"
import type { PropsWithChildren } from "react"
import { cx } from "~/utils/cva"

type AnimatedContainerProps = Omit<HTMLMotionProps<"div">, "animate" | "children"> &
  PropsWithChildren<{
    width?: boolean
    height?: boolean
  }>

export const AnimatedContainer = (props: AnimatedContainerProps) => {
  const { children, className, width, height, transition, ...rest } = props
  const shouldReduceMotion = useReducedMotion()
  const [ref, rect] = useResizeObserver()

  if (shouldReduceMotion) {
    return <Slot.Root className={className}>{children}</Slot.Root>
  }

  const motionProps: HTMLMotionProps<"div"> = {
    style: { visibility: height && rect.height === 0 ? "hidden" : undefined },
    transition: transition ?? { type: "spring", duration: 0.3 },
    animate: {
      width: width ? rect.width : undefined,
      height: height ? rect.height : undefined,
    },
  }

  return (
    <motion.div className={cx("overflow-hidden", className)} {...motionProps} {...rest}>
      <div ref={ref} className={cx(height && "h-max", width && "w-max")}>
        <Slot.Root className="animate-fade-in">{children}</Slot.Root>
      </div>
    </motion.div>
  )
}
