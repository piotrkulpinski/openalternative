"use client"

import type { ComponentProps } from "react"
import { Toaster as Sonner } from "sonner"
import { cx } from "~/utils/cva"

const Toaster = ({ className, ...props }: ComponentProps<typeof Sonner>) => {
  return (
    <Sonner
      className={cx("bg-background text-foreground shadow-lg select-none", className)}
      toastOptions={{
        classNames: {
          description: "text-muted-foreground",
          actionButton: "bg-primary text-primary-foreground",
          cancelButton: "bg-muted text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
