"use client"

import { CheckCircleIcon, LoaderIcon, XCircleIcon } from "lucide-react"
import type { ComponentProps } from "react"
import { Toaster as Sonner } from "sonner"

const Toaster = ({ className, ...props }: ComponentProps<typeof Sonner>) => {
  return (
    <Sonner
      className="pointer-events-auto"
      toastOptions={{
        classNames: {
          default: "bg-background! border-border! rounded-lg shadow-sm!",
          success: "[&_svg]:text-green-700",
          error: "bg-destructive! text-destructive-foreground!",
          description: "text-muted-foreground",
          actionButton: "bg-primary! text-primary-foreground!",
          cancelButton: "bg-muted! text-muted-foreground!",
          toast: className,
        },
      }}
      icons={{
        success: <CheckCircleIcon className="size-4" />,
        error: <XCircleIcon className="size-4" />,
        loading: <LoaderIcon className="size-4 animate-spin" />,
      }}
      {...props}
    />
  )
}

export { Toaster }
