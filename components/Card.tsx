"use client"

import { CardPanel, Card as CardRoot, cx } from "@curiousleaf/design"
import { useMotionValue } from "framer-motion"
import Link from "next/link"
import { HTMLAttributes } from "react"
import { DynamicPattern } from "./pattern/DynamicPattern"

type CardProps = HTMLAttributes<HTMLDivElement> & {
  href: string
}

export const Card = ({ className, href, ...props }: CardProps) => {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const onMouseMove = ({ currentTarget, clientX, clientY }: React.MouseEvent<HTMLDivElement>) => {
    const { left, top } = currentTarget.getBoundingClientRect()

    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <CardRoot className="card group hover:bg-gray-50" onMouseMove={onMouseMove} asChild>
      <Link href={href} prefetch={false}>
        <CardPanel
          className={cx("relative z-10 flex flex-1 flex-col items-start gap-4", className)}
          {...props}
        />

        <DynamicPattern
          width={76}
          height={56}
          x="50%"
          y="-6"
          squares={[[0, 1]]}
          mouseX={mouseX}
          mouseY={mouseY}
        />
      </Link>
    </CardRoot>
  )
}
