import type { ComponentProps } from "react"
import { cx } from "~/utils/cva"

export const Skeleton = ({ className, ...props }: ComponentProps<"span">) => {
  return (
    <span className={cx("block animate-pulse rounded-md bg-foreground/10", className)} {...props} />
  )
}
