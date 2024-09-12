import { Slot } from "@radix-ui/react-slot"
import type * as React from "react"
import { H3 } from "~/components/ui/heading"

import { cx } from "~/utils/cva"

interface DataTableHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  total?: number
  callToAction?: React.ReactNode
}

export function DataTableHeader({
  title,
  total,
  callToAction,
  children,
  className,
  ...props
}: DataTableHeaderProps) {
  return (
    <div
      className={cx(
        "sticky top-0 z-20 flex flex-col gap-4 py-4 -my-4 w-full bg-background overflow-auto",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-4">
        <H3 as="h1">
          {title}
          {typeof total === "number" && <span className="ml-1.5 opacity-40">({total})</span>}
        </H3>

        <Slot className="-my-0.5">{callToAction}</Slot>
      </div>

      {children}
    </div>
  )
}
