import { cx } from "cva"
import { HTMLAttributes } from "react"

export const Grid = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  return <div className={cx("grid grid-cols-3 gap-6", className)} {...props} />
}
