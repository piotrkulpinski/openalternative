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
          default: "w-72! border-0! ring ring-background/50 rounded-lg shadow-sm!",
          info: "bg-foreground! text-background!",
          success: "bg-green-600! text-white!",
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
