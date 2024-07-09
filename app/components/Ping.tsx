import type { HTMLAttributes } from "react"
import { cx } from "~/utils/cva"

type PingProps = HTMLAttributes<HTMLElement> & {
  label?: string
}

export const Ping = ({ className, label, ...props }: PingProps) => {
  return (
    <div className={cx("flex items-center gap-1", className)} {...props}>
      <div className="relative size-3">
        <div className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
        <div className="absolute inset-0 animate-pulse rounded-full bg-primary/30" />
        <div className="absolute inset-[3px] rounded-full bg-primary" />
      </div>

      {label && <div className="font-medium uppercase text-primary">{label}</div>}
    </div>
  )
}
