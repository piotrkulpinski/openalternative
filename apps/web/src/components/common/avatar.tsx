"use client"

import * as AvatarPrimitive from "@radix-ui/react-avatar"
import type { ComponentProps } from "react"
import { cx } from "~/utils/cva"

const Avatar = ({ className, ...props }: ComponentProps<typeof AvatarPrimitive.Root>) => (
  <AvatarPrimitive.Root
    className={cx("relative flex size-10 shrink-0 overflow-clip rounded-full", className)}
    {...props}
  />
)

const AvatarImage = ({ className, ...props }: ComponentProps<typeof AvatarPrimitive.Image>) => (
  <AvatarPrimitive.Image className={cx("aspect-square size-full", className)} {...props} />
)

const AvatarFallback = ({
  className,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Fallback>) => (
  <AvatarPrimitive.Fallback
    className={cx("flex size-full items-center justify-center text-xs", className)}
    {...props}
  />
)

export { Avatar, AvatarImage, AvatarFallback }
