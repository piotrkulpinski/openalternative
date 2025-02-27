import type { ComponentProps } from "react"
import { cx } from "~/utils/cva"

export const EmptyList = ({ className, ...props }: ComponentProps<"p">) => {
  return <p className={cx("col-span-full text-muted-foreground", className)} {...props} />
}
