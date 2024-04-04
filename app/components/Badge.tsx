import { HTMLAttributes } from "react"
import { cx } from "~/utils/cva"

export const Badge = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  return (
    <span
      className={cx(
        "rounded bg-neutral-200/60 px-1.5 py-0.5 text-xs text-neutral-600 dark:bg-neutral-700/60 dark:text-neutral-200",
        className
      )}
      {...props}
    />
  )
}
