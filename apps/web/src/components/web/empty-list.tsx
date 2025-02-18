import type { HTMLAttributes } from "react"
import { cx } from "~/utils/cva"

export const EmptyList = ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => {
  return <p className={cx("col-span-full text-muted-foreground", className)} {...props} />
}
