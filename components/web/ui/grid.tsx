import type { ComponentProps } from "react"
import { cx } from "~/utils/cva"

export const Grid = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div
      className={cx(
        "w-full grid grid-cols-1 place-content-start gap-5 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
      {...props}
    />
  )
}
