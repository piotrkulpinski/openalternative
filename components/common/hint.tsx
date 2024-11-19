import type { ComponentProps } from "react"
import { cx } from "~/utils/cva"

export const Hint = ({ className, ...props }: ComponentProps<"p">) => {
  return <p className={cx("-mt-1 text-xs font-medium text-red-500/75", className)} {...props} />
}
