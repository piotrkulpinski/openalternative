import type { ComponentProps } from "react"
import { cx } from "~/utils/cva"

export const Skeleton = ({ className, ...props }: ComponentProps<"div">) => {
  return <div className={cx("animate-pulse rounded-md bg-foreground/10", className)} {...props} />
}
