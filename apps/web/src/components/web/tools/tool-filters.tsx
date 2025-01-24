"use client"

import type { HTMLAttributes } from "react"
import { cx } from "~/utils/cva"

export const ToolFilters = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cx(
        "grid grid-auto-fill-xs justify-between gap-6 w-full py-4 px-6 border rounded-md",
        className,
      )}
      {...props}
    />
  )
}
