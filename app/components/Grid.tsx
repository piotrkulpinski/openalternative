import { HTMLAttributes } from "react"
import { cx } from "~/utils/cva"

export const Grid = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  return <div className={cx("grid-auto-fill-md grid gap-6", className)} {...props} />
}
