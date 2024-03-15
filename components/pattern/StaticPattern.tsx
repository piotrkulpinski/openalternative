import { cx } from "@curiousleaf/design"
import { MotionValue, motion, useMotionTemplate } from "framer-motion"
import { ComponentPropsWithoutRef } from "react"
import { GridPattern } from "~/components/pattern/GridPattern"

type StaticPatternProps = ComponentPropsWithoutRef<typeof GridPattern>

export const StaticPattern = ({ className, ...props }: StaticPatternProps) => {
  return (
    <div
      className={cx(
        "pointer-events-none absolute inset-0 [mask-image:linear-gradient(white,transparent)] group-hover:opacity-75",
        className,
      )}
    >
      <GridPattern className="dark:fill-white/1 dark:stroke-white/2.5" {...props} />
    </div>
  )
}
