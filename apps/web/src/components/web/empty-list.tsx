import type { HTMLAttributes } from "react"
import { cx } from "~/utils/cva"

export const EmptyList = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  return <p className={cx("col-span-full text-muted", className)} {...props} />
}
