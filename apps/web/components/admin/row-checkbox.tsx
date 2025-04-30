import type { ComponentProps } from "react"
import { cx } from "~/utils/cva"

export const RowCheckbox = ({ className, ...props }: ComponentProps<"input">) => {
  return (
    <input
      type="checkbox"
      className={cx("block relative z-10 translate-x-1", className)}
      {...props}
    />
  )
}
