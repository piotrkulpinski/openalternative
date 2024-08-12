import { formatNumber } from "@curiousleaf/utils"
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import { Link, json, useLoaderData, useLocation } from "@remix-run/react"
import { GemIcon } from "lucide-react"
import plur from "plur"
import { renderToString } from "react-dom/server"
import {
  InstantSearchSSRProvider,
  type InstantSearchServerState,
  getServerState,
} from "react-instantsearch"
import { Badge } from "~/components/Badge"
import { Intro } from "~/components/Intro"
import { Ping } from "~/components/Ping"
import { Newsletter } from "~/partials/Newsletter"
import { Search } from "~/routes/_index/Search"
import { getFeatureFlagValue } from "~/services.server/posthog"
import { prisma } from "~/services.server/prisma"
import {
  LATEST_TOOLS_TRESHOLD,
  SITE_DESCRIPTION,
  SITE_STATS,
  SITE_TAGLINE,
} from "~/utils/constants"
import { getMetaTags } from "~/utils/meta"

export const meta: MetaFunction = ({ matches, location }) => {
  return getMetaTags({
    location,
    title: SITE_TAGLINE,
    description: SITE_DESCRIPTION,
    parentMeta: matches.find(({ id }) => id === "root")?.meta,
  })
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url)

  const [sponsoring, newToolCount, newsletterFlag] = await Promise.all([
    // Find sponsoring
    prisma.sponsoring.findFirst({
      where: { startsAt: { lte: new Date() }, endsAt: { gt: new Date() } },
      select: { name: true, description: true, website: true, faviconUrl: true },
    }),

    // Find too count
    prisma.tool.count({
      where: { publishedAt: { gte: LATEST_TOOLS_TRESHOLD, lte: new Date() } },
    }),

    // Get newsletter test value
    getFeatureFlagValue(request, "newsletter-conversion"),
  ])

  const serverState = await getServerState(<Search url={url} sponsoring={sponsoring} />, {
    renderToString,
  })

  return json({ url, sponsoring, newToolCount, serverState, newsletterFlag })
}

export default function Index() {
  const { key } = useLocation()
  const { url, sponsoring, newToolCount, serverState, newsletterFlag } =
    useLoaderData<typeof loader>()

  return (
    <>
      <section className="flex flex-col gap-y-6 w-full mb-[2vh] lg:mt-[1vh]">
        <Intro
          title="Discover Open Source Alternatives to Popular Software"
          description="A curated collection of the best open source alternatives to software that your business requires in day-to-day operations."
          alignment="center"
          className="max-w-[35rem] mx-auto"
        >
          <Badge
            className="order-first inline-flex items-center gap-1.5 px-2 py-1 rounded-md"
            prefix={newToolCount ? <Ping /> : <GemIcon />}
            asChild
          >
            <Link to="/latest">
              {newToolCount
                ? `${newToolCount} new ${plur("tool", newToolCount)} added`
                : `${formatNumber(SITE_STATS.tools)}+ open source tools`}
            </Link>
          </Badge>
        </Intro>

        <Newsletter
          size="md"
          buttonLabel="Join our community"
          buttonVariant="fancy"
          className="w-full items-center"
        >
          <div className="flex flex-wrap items-center justify-center text-center gap-y-1 -space-x-1.5">
            {newsletterFlag === "proof" &&
              Array.from({ length: 5 }).map((_, index) => (
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

      <InstantSearchSSRProvider key={key} {...(serverState as InstantSearchServerState)}>
        <Search url={url} sponsoring={sponsoring} />
      </InstantSearchSSRProvider>
    </>
  )
}
