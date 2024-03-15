import { cx } from "@curiousleaf/design"
import { HTMLAttributes } from "react"

export const Box = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  return (
    <div
      className={cx(
        "rounded-md bg-white p-1.5 shadow-md shadow-gray-800/5 ring-1 ring-gray-900/5",
        className,
      )}
      {...props}
    />
  )
}
