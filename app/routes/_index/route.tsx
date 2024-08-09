import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import { Link, json, useLoaderData, useLocation } from "@remix-run/react"
import { GemIcon } from "lucide-react"
import plur from "plur"
import { Fragment } from "react/jsx-runtime"
import { Badge } from "~/components/Badge"
import { Grid } from "~/components/Grid"
import { Intro } from "~/components/Intro"
import { Ping } from "~/components/Ping"
import { SponsoredCard } from "~/components/SponsoredCard"
import { Newsletter } from "~/partials/Newsletter"
import { ToolRecord } from "~/partials/records/ToolRecord"
import { toolManyPayload } from "~/services.server/api"
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

  const [sponsoring, newToolCount, tools] = await Promise.all([
    prisma.sponsoring.findFirst({
      where: { startsAt: { lte: new Date() }, endsAt: { gt: new Date() } },
      select: { name: true, description: true, website: true, faviconUrl: true },
    }),

    prisma.tool.count({
      where: { publishedAt: { gte: LATEST_TOOLS_TRESHOLD, lte: new Date() } },
    }),

    prisma.tool.findMany({
      where: { publishedAt: { lte: new Date() } },
      include: toolManyPayload,
      orderBy: [{ isFeatured: "desc" }, { score: "desc" }],
    }),
  ])

  // const serverState = await getServerState(<Search url={url} sponsoring={sponsoring} />, {
  //   renderToString,
  // })

  return json({ url, sponsoring, newToolCount, tools })
}

export default function Index() {
  const { key } = useLocation()
  const { url, sponsoring, newToolCount, tools } = useLoaderData<typeof loader>()

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
                : `${SITE_STATS.tools.toLocaleString()}+ open source tools`}
            </Link>
          </Badge>
        </Intro>

        <Newsletter
          placeholder="Get our newsletter"
          note={`Join ${SITE_STATS.subscribers.toLocaleString()}+ open source enthusiasts`}
          size="md"
          buttonVariant="fancy"
          className="w-full items-center"
        />
      </section>

      <Grid>
        {tools.map((tool, order) => (
          <Fragment key={tool.id}>
            {Math.min(2, tools.length - 1) === order && <SponsoredCard sponsoring={sponsoring} />}

            <ToolRecord tool={tool} style={{ order }} />
          </Fragment>
        ))}

        {!tools?.length && <p className="col-span-full">No Open Source software found.</p>}
      </Grid>

      {/* <InstantSearchSSRProvider key={key} {...(serverState as InstantSearchServerState)}>
        <Search url={url} sponsoring={sponsoring} />
      </InstantSearchSSRProvider> */}
    </>
  )
}
