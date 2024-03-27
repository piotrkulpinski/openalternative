import { HTMLAttributes } from "react"
import { cx } from "~/utils/cva"

type PingProps = HTMLAttributes<HTMLElement> & {
  label?: string
}

export const Ping = ({ className, label, ...props }: PingProps) => {
  return (
    <div className={cx("flex items-center gap-1", className)} {...props}>
      <div className="relative size-3">
        <div className="absolute inset-0 animate-ping rounded-full bg-green-500/30"></div>
        <div className="absolute inset-0 animate-pulse rounded-full bg-green-500/30"></div>
        <div className="absolute inset-[3px] rounded-full bg-green-500"></div>
      </div>

      {label && <div className="font-medium uppercase text-green-500">{label}</div>}
    </div>
  )
}
