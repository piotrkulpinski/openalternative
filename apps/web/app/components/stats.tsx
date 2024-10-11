import type { HTMLAttributes } from "react"
import { Stat } from "~/components/ui/stat"
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
      {stats.map(({ value, label }, index) => (
        <div
          key={`${index}-${label}`}
          className="flex flex-col items-center gap-1 flex-1 basis-[12rem]"
        >
          <Stat
            value={value}
            format={{ notation: "compact" }}
            locales="en-US"
            // @ts-ignore
            style={{ "--number-flow-char-height": "0.75em" }}
            className="text-5xl font-semibold tabular-nums"
          />
          <p className="text-muted">{label}</p>
        </div>
      ))}
    </div>
  )
}
