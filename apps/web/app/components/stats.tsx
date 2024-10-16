import { Link } from "@remix-run/react"
import type { ComponentProps, HTMLAttributes } from "react"
import { Stat } from "~/components/ui/stat"
import { ANALYTICS_URL, GITHUB_URL, SITE_STATS } from "~/utils/constants"
import { cx } from "~/utils/cva"

const StatLink = ({ href, ...props }: ComponentProps<"a">) => {
  if (!href) {
    return <div {...(props as HTMLAttributes<HTMLDivElement>)} />
  }

  if (href.startsWith("/")) {
    return <Link to={href} unstable_viewTransition {...props} />
  }

  return <a href={href} target="_blank" rel="noopener noreferrer nofollow" {...props} />
}

export const Stats = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  const stats = [
    { value: SITE_STATS.pageviews, label: "Monthly Pageviews", link: ANALYTICS_URL },
    { value: SITE_STATS.tools, label: "Listed Projects", link: "/" },
    { value: SITE_STATS.subscribers, label: "Newsletter Subscribers", link: "/newsletter" },
    { value: SITE_STATS.stars, label: "GitHub Stars", link: GITHUB_URL },
  ]

  return (
    <div
      className={cx("flex flex-wrap items-center justify-around gap-x-4 gap-y-8", className)}
      {...props}
    >
      {stats.map(({ value, label, link }, index) => (
        <StatLink
          key={`${index}-${label}`}
          href={link}
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
