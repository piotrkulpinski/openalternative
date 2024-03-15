import { cx } from "@curiousleaf/design"
import { HTMLAttributes } from "react"

export const Grid = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return <div className={cx("grid gap-6 grid-auto-fill-md", className)} {...props} />
}
