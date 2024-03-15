"use client"

import { cx } from "@curiousleaf/design"
import { ComponentPropsWithoutRef, useId } from "react"

type GridPatternProps = ComponentPropsWithoutRef<"svg"> & {
  width: number
  height: number
  x: string | number
  y: string | number
  squares: Array<[x: number, y: number]>
}

export const GridPattern = ({
  className,
  width,
  height,
  x,
  y,
  squares,
  ...props
}: GridPatternProps) => {
  const patternId = useId()

  return (
    <svg
      aria-hidden="true"
      className={cx(
        "absolute inset-x-0 inset-y-[-4.5rem] h-[calc(100%+4.5rem)] w-full skew-y-[-10deg] fill-black/[0.02] stroke-black/5",
        className,
      )}
      {...props}
    >
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>

      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${patternId})`} />

      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          <title>Tiles</title>
          {squares.map(([x, y]) => (
            <rect
              strokeWidth="0"
              key={`${x}-${y}`}
              width={width + 1}
              height={height + 1}
              x={x * width}
              y={y * height}
            />
          ))}
        </svg>
      )}
    </svg>
  )
}
