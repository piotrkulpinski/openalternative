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
          default: "bg-background! text-foreground! border-border! rounded-lg shadow-sm!",
          description: "text-muted-foreground",
          actionButton: "bg-primary! text-primary-foreground!",
          cancelButton: "bg-muted! text-muted-foreground!",
          toast: className,
        },
      }}
      icons={{
        success: <CheckCircleIcon className="size-4 text-green-700" />,
        error: <XCircleIcon className="size-4 text-destructive" />,
        loading: <LoaderIcon className="size-4 animate-spin" />,
      }}
      {...props}
    />
  )
}

export { Toaster }
