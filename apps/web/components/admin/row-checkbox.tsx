import type { ComponentProps } from "react"
import { cx } from "~/utils/cva"

export const RowCheckbox = ({ className, ...props }: ComponentProps<"input">) => {
  return (
    <input
      type="checkbox"
      className={cx("relative z-10 translate-y-0.5 ml-1.5", className)}
      {...props}
    />
  )
}
