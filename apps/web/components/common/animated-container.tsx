"use client"

import { useReducedMotion, useResizeObserver } from "@mantine/hooks"
import { type HTMLMotionProps, motion } from "motion/react"
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

  const dimensions = {
    width: width ? rect.width : undefined,
    height: height ? rect.height : undefined,
  }

  const motionProps: HTMLMotionProps<"div"> = {
    ...(shouldReduceMotion
      ? { style: dimensions }
      : {
          style: { visibility: height && rect.height === 0 ? "hidden" : undefined },
          animate: dimensions,
          transition: transition ?? { type: "spring", duration: 0.3 },
        }),
  }

  return (
    <motion.div className={cx("overflow-hidden", className)} {...motionProps} {...rest}>
      <div ref={ref} className={cx(height && "h-max", width && "w-max")}>
        {children}
      </div>
    </motion.div>
  )
}
