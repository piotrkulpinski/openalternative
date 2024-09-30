import type { HTMLAttributes } from "react"
import { cx } from "~/utils/cva"

export const Ping = ({ className, children, ...props }: HTMLAttributes<HTMLElement>) => {
  return (
    <div className={cx("relative size-3 text-primary", className)} {...props}>
      <div className="absolute inset-0 animate-ping rounded-full bg-current opacity-30" />
      <div className="absolute inset-0 animate-pulse rounded-full bg-current opacity-30" />
      <div className="absolute inset-[3px] rounded-full bg-current" />
    </div>
  )
}
