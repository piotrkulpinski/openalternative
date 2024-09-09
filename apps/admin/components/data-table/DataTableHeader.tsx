import type * as React from "react"
import { H3 } from "~/components/ui/Heading"

import { cx } from "~/utils/cva"

interface DataTableHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  callToAction?: React.ReactNode
}

export function DataTableHeader({
  title,
  callToAction,
  children,
  className,
  ...props
}: DataTableHeaderProps) {
  return (
    <div
      className={cx(
        "sticky top-0 z-20 flex flex-col gap-4 py-4 -my-4 w-full bg-white overflow-auto",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <H3 as="h1">{title}</H3>

        {callToAction}
      </div>

      {children}
    </div>
  )
}
