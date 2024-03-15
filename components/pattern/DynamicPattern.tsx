"use client"

import { cx } from "@curiousleaf/design"
import { MotionValue, motion, useMotionTemplate } from "framer-motion"
import { ComponentPropsWithoutRef } from "react"
import { GridPattern } from "~/components/pattern/GridPattern"

type DynamicPatternProps = ComponentPropsWithoutRef<typeof GridPattern> & {
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
}

export const DynamicPattern = ({
  className,
  mouseX,
  mouseY,
  ...gridProps
}: DynamicPatternProps) => {
  const maskImage = useMotionTemplate`radial-gradient(180px at ${mouseX}px ${mouseY}px, white, transparent)`
  const style = { maskImage, WebkitMaskImage: maskImage }

  return (
    <div className={cx("pointer-events-none", className)}>
      <div className="absolute inset-0 transition duration-300 [mask-image:linear-gradient(white,transparent)] group-hover:opacity-50">
        <GridPattern className="dark:fill-white/1 dark:stroke-white/2.5" {...gridProps} />
      </div>

      <motion.div
        className="absolute inset-0 bg-gray-200/50 opacity-0 transition duration-300 group-hover:opacity-100 dark:from-[#202D2E] dark:to-[#303428]"
        style={style}
      />

      <motion.div
        className="absolute inset-0 opacity-0 mix-blend-overlay transition duration-300 group-hover:opacity-100"
        style={style}
      >
        <GridPattern
          className="dark:fill-white/2.5 fill-black/50 stroke-black/70 dark:stroke-white/10"
          {...gridProps}
        />
      </motion.div>
    </div>
  )
}
