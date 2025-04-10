"use client"

import { Dialog as DialogPrimitive } from "radix-ui"
import type { ComponentProps } from "react"
import { H4 } from "~/components/common/heading"
import { Prose } from "~/components/common/prose"
import { cx } from "~/utils/cva"
import { Icon } from "./icon"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

const DialogOverlay = ({ className, ...props }: ComponentProps<typeof DialogPrimitive.Overlay>) => (
  <DialogPrimitive.Overlay
    className={cx(
      "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
      className,
    )}
    {...props}
  />
)

const DialogContent = ({
  className,
  children,
  ...props
}: ComponentProps<typeof DialogPrimitive.Content>) => {
  return (
    <DialogPortal>
      <DialogOverlay />

      <div className="fixed inset-0 z-50 flex h-screen items-start justify-center px-4 py-6 sm:pt-[25vh]">
        <DialogPrimitive.Content
          className={cx(
            "relative max-h-full w-full max-w-lg grid gap-4 border bg-background p-4 rounded-md shadow-lg overflow-y-auto overscroll-contain sm:p-6 sm:rounded-lg",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
            "data-[state=open]:slide-in-from-bottom-4 data-[state=closed]:slide-out-to-bottom-4",
            className,
          )}
          {...props}
        >
          {children}
          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-ring disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <Icon name="lucide/x" className="size-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </div>
    </DialogPortal>
  )
}

const DialogHeader = ({ className, ...props }: ComponentProps<"div">) => {
  return <div className={cx("flex flex-col gap-2 text-start", className)} {...props} />
}

const DialogFooter = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      className={cx(
        "flex flex-col-reverse gap-2 -m-4 mt-0 px-4 py-3 border-t md:flex-row md:justify-between sm:-m-6 sm:mt-0 sm:px-6 sm:py-4",
        className,
      )}
      {...props}
    />
  )
}

const DialogTitle = ({ children, ...props }: ComponentProps<typeof DialogPrimitive.Title>) => {
  return (
    <DialogPrimitive.Title asChild {...props}>
      <H4>{children}</H4>
    </DialogPrimitive.Title>
  )
}

const DialogDescription = ({
  children,
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) => {
  return (
    <DialogPrimitive.Description asChild className={cx("text-sm/normal", className)} {...props}>
      <Prose>{children}</Prose>
    </DialogPrimitive.Description>
  )
}

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
