"use client"

import { Avatar as AvatarPrimitive } from "radix-ui"
import type { ComponentProps } from "react"
import { cx } from "~/utils/cva"

const Avatar = ({ className, ...props }: ComponentProps<typeof AvatarPrimitive.Root>) => {
  return (
    <AvatarPrimitive.Root
      className={cx(
        "relative flex size-10 shrink-0 overflow-clip bg-accent rounded-full",
        className,
      )}
      {...props}
    />
  )
}

const AvatarImage = ({ className, ...props }: ComponentProps<typeof AvatarPrimitive.Image>) => {
  return <AvatarPrimitive.Image className={cx("aspect-square size-full", className)} {...props} />
}

const AvatarFallback = ({
  className,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Fallback>) => {
  return (
    <AvatarPrimitive.Fallback
      className={cx("flex size-full items-center justify-center text-xs", className)}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }
