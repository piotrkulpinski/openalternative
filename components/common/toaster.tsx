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
            "select-none bg-background text-foreground border-border! shadow-xs! data-[type=error]:text-red-700/75! data-[type=success]:text-green-700/75! data-[type=info]:text-foreground/65!",
            className,
          ),
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
