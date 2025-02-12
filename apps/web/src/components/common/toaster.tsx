"use client"

import type { ComponentProps } from "react"
import { Toaster as Sonner } from "sonner"

const Toaster = ({ className, ...props }: ComponentProps<typeof Sonner>) => {
  return (
    <Sonner
      className="pointer-events-auto"
      toastOptions={{
        classNames: {
          default: "bg-background text-foreground border-background! shadow-xs!",
          error: "bg-destructive! text-destructive-foreground!",
          success: "bg-green-700! text-white!",
          description: "text-muted-foreground",
          actionButton: "bg-primary text-primary-foreground",
          cancelButton: "bg-muted text-muted-foreground",
          toast: className,
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
