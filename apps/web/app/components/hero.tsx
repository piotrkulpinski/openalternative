import { formatNumber } from "@curiousleaf/utils"
import { Link } from "@remix-run/react"
import { GemIcon } from "lucide-react"
import plur from "plur"
import type { HTMLAttributes } from "react"
import { Newsletter } from "~/components/newsletter"
import { Badge } from "~/components/ui/badge"
import { Intro } from "~/components/ui/intro"
import { Ping } from "~/components/ui/ping"
import { SITE_STATS } from "~/utils/constants"
import { cx } from "~/utils/cva"

type HeroProps = HTMLAttributes<HTMLDivElement> & {
  toolCount: number
}

export const Hero = ({ className, toolCount, ...props }: HeroProps) => {
  return (
    <section
      className={cx("flex flex-col gap-y-6 w-full mb-[2vh] lg:mt-[1vh]", className)}
      {...props}
    >
      <Intro
        title="Discover Open Source Alternatives to Popular Software"
        description="A curated collection of the best open source alternatives to software that your business requires in day-to-day operations."
        alignment="center"
        className="max-w-[35rem] mx-auto"
      >
        <Badge
          className="order-first inline-flex items-center gap-1.5 px-2 py-1 rounded-md"
          prefix={toolCount ? <Ping /> : <GemIcon />}
          asChild
        >
          <Link to="/latest">
            {toolCount
              ? `${toolCount} new ${plur("tool", toolCount)} added`
              : `${formatNumber(SITE_STATS.tools)}+ open source tools`}
          </Link>
        </Badge>
      </Intro>

      <Newsletter
        size="lg"
        className="w-full mx-auto items-center text-center"
        buttonProps={{ children: "Join our community", size: "md", variant: "fancy" }}
      >
        <div className="flex flex-wrap items-center justify-center text-center gap-y-1 -space-x-1.5">
          {Array.from({ length: 5 }).map((_, index) => (
            <img
              key={index}
              src={`/users/${index + 1}.jpg`}
              alt=""
              width="40"
              height="40"
              className="size-7 border-2 border-card rounded-full"
            />
          ))}

          <p className="w-full text-xs text-muted">
            Join {formatNumber(SITE_STATS.subscribers, "standard")}+ open source enthusiasts
          </p>
        </div>
      </Newsletter>
    </section>
  )
}
