import type { ComponentProps } from "react"
import { cx } from "~/utils/cva"

export const Ping = ({ className, ...props }: ComponentProps<"div">) => {
  return (
    <div className={cx("relative size-3 text-primary", className)} {...props}>
      <div className="absolute inset-0 animate-ping rounded-full bg-current opacity-30 pointer-events-none blur-[1px]" />
      <div className="absolute inset-0 animate-pulse rounded-full bg-current opacity-30 pointer-events-none" />
      <div className="absolute inset-[3px] rounded-full bg-current" />
    </div>
  )
}
