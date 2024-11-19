import Link from "next/link"
import type { ComponentProps, HTMLAttributes } from "react"
import { Stat } from "~/components/ui/stat"
import { config } from "~/config"
import { cx } from "~/utils/cva"

const StatLink = ({ href, ...props }: ComponentProps<"a">) => {
  if (!href) {
    return <div {...(props as HTMLAttributes<HTMLDivElement>)} />
  }

  if (href.startsWith("/")) {
    return <Link href={href} {...props} />
  }

  return <a href={href} target="_blank" rel="noopener noreferrer nofollow" {...props} />
}

export const Stats = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  const stats = [
    { value: config.stats.pageviews, label: "Monthly Pageviews" },
    { value: config.stats.tools, label: "Listed Projects" },
    { value: config.stats.subscribers, label: "Newsletter Subscribers" },
    { value: config.stats.stars, label: "GitHub Stars" },
  ]

  return (
    <div
      className={cx("flex flex-wrap items-center justify-around gap-x-4 gap-y-8", className)}
      {...props}
    >
      {stats.map(({ value, label }, index) => (
        <StatLink
          key={`${index}-${label}`}
          className="flex flex-col items-center gap-1 basis-[12rem] hover:[&[href]]:opacity-80"
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
        </StatLink>
      ))}
    </div>
  )
}
