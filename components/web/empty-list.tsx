import type { HTMLAttributes } from "react"
import { cx } from "~/utils/cva"

export const EmptyList = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  return <p className={cx("col-span-full mt-2 text-muted", className)} {...props} />
}
