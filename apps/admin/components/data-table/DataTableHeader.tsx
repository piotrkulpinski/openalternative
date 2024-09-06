import { Slot } from "@radix-ui/react-slot"
import type * as React from "react"

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
        "sticky top-0 z-10 flex flex-col gap-4 py-4 -my-4 w-full bg-white overflow-auto",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold leading-none tracking-tight">{title}</h1>
        <Slot className="-my-2">{callToAction}</Slot>
      </div>
      {children}
    </div>
  )
}
