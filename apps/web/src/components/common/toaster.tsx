"use client"

import type { ComponentProps } from "react"
import { Toaster as Sonner } from "sonner"
import { cx } from "~/utils/cva"

const Toaster = ({ className, ...props }: ComponentProps<typeof Sonner>) => {
  return (
    <Sonner
      toastOptions={{
        classNames: {
          description: "text-muted-foreground",
          actionButton: "bg-primary text-primary-foreground",
          cancelButton: "bg-muted text-muted-foreground",
          toast: cx(
            "select-none bg-background text-foreground border-background! shadow-xs!",
            "data-[type=error]:bg-destructive! data-[type=error]:text-destructive-foreground! data-[type=success]:bg-green-700! data-[type=success]:text-white!",
            className,
          ),
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
