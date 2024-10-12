import { formatNumber } from "@curiousleaf/utils"
import { Link } from "@remix-run/react"
import { GemIcon } from "lucide-react"
import plur from "plur"
import type { HTMLAttributes } from "react"
import { Newsletter } from "~/components/newsletter"
import { NewsletterProof } from "~/components/newsletter-proof"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Intro } from "~/components/ui/intro"
import { Ping } from "~/components/ui/ping"
import { Stack } from "~/components/ui/stack"
import { SITE_STATS } from "~/utils/constants"
import { cx } from "~/utils/cva"

type HeroProps = HTMLAttributes<HTMLDivElement> & {
  toolCount: number
  hideNewsletter?: boolean
}

export const Hero = ({ className, toolCount, hideNewsletter, ...props }: HeroProps) => {
  return (
    <section className={cx("flex flex-col gap-y-6 w-full mb-[2vh]", className)} {...props}>
      <Intro
        title="Discover Open Source Alternatives to Popular Software"
        description="A curated collection of the best open source alternatives to software that your business requires in day-to-day operations."
        alignment="center"
        className="max-w-[37.5rem] mx-auto"
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

      {hideNewsletter ? (
        <Stack className="mx-auto place-content-center">
          <Button variant="secondary" asChild>
            <Link to="/alternatives" unstable_viewTransition>
              Browse by Alternatives
            </Link>
          </Button>

          <Button variant="secondary" asChild>
            <Link to="/submit" unstable_viewTransition>
              Submit a Tool
            </Link>
          </Button>
        </Stack>
      ) : (
        <Newsletter
          size="lg"
          className="w-full mx-auto items-center text-center"
          buttonProps={{ children: "Join our community", size: "md", variant: "fancy" }}
        >
          <NewsletterProof />
        </Newsletter>
      )}
    </section>
  )
}
