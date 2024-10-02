import { formatNumber } from "@curiousleaf/utils"
import type { HTMLAttributes } from "react"
import { SITE_STATS } from "~/utils/constants"
import { cx } from "~/utils/cva"

export const Stats = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  const stats = [
    { value: SITE_STATS.pageviews, label: "Monthly Pageviews" },
    { value: SITE_STATS.tools, label: "Listed Projects" },
    { value: SITE_STATS.subscribers, label: "Newsletter Subscribers" },
    { value: SITE_STATS.stars, label: "GitHub Stars" },
  ]

  return (
    <div
      className={cx("flex flex-wrap items-center justify-around gap-x-4 gap-y-8", className)}
      {...props}
    >
      {stats.map(({ value, label }) => (
        <div key={value} className="flex flex-col items-center gap-2 flex-1 basis-[12rem]">
          <strong className="text-5xl font-semibold tabular-nums">{formatNumber(value)}</strong>
          <p className="text-muted">{label}</p>
        </div>
      ))}
    </div>
  )
}
