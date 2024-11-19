import { type HTMLAttributes, forwardRef } from "react"
import { cx } from "~/utils/cva"

export const Ping = forwardRef<HTMLDivElement, HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cx("relative size-3 text-primary", className)} {...props}>
        <div className="absolute inset-0 animate-ping rounded-full bg-current opacity-30 pointer-events-none blur-[1px]" />
        <div className="absolute inset-0 animate-pulse rounded-full bg-current opacity-30 pointer-events-none" />
        <div className="absolute inset-[3px] rounded-full bg-current" />
      </div>
    )
  },
)
