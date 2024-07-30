import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import { Link, json, useLoaderData, useLocation } from "@remix-run/react"
import { renderToString } from "react-dom/server"
import {
  InstantSearchSSRProvider,
  InstantSearchServerState,
  getServerState,
} from "react-instantsearch"
import { Badge } from "~/components/Badge"
import { Intro } from "~/components/Intro"
import { Newsletter } from "~/partials/Newsletter"
import { Ping } from "~/components/Ping"
import { prisma } from "~/services.server/prisma"
import { LATEST_TOOLS_TRESHOLD, SITE_DESCRIPTION, SITE_TAGLINE } from "~/utils/constants"
import { getMetaTags } from "~/utils/meta"
import { Search } from "./Search"
import plur from "plur"

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

  const [sponsoring, newToolCount] = await Promise.all([
    prisma.sponsoring.findFirst({
      where: { startsAt: { lte: new Date() }, endsAt: { gt: new Date() } },
      select: { name: true, description: true, website: true, faviconUrl: true },
    }),

    prisma.tool.count({
      where: { publishedAt: { gte: LATEST_TOOLS_TRESHOLD, lte: new Date() } },
    }),
  ])

  const serverState = await getServerState(<Search url={url} sponsoring={sponsoring} />, {
    renderToString,
  })

  return json({ serverState, url, sponsoring, newToolCount })
}

export default function Index() {
  const { key } = useLocation()
  const { serverState, url, sponsoring, newToolCount } = useLoaderData<typeof loader>()

  return (
    <>
      <div className="flex gap-6">
        <section className="flex flex-col gap-y-6 mb-[2vh] sm:items-center sm:text-center sm:max-w-[35rem] sm:mx-auto md:flex-1 lg:mt-[1vh]">
          <Intro
            title="Discover Open Source Alternatives to Popular Software"
            description="A curated collection of the best open source alternatives to software that your business requires in day-to-day operations."
            className="sm:items-center sm:text-center"
          >
            {!!newToolCount && (
              <Badge
                className="order-first inline-flex items-center gap-1.5 px-2 py-1 rounded-md"
                asChild
              >
                <Link to="/latest">
                  <Ping /> {newToolCount} new {plur("tool", newToolCount)} added
                </Link>
              </Badge>
            )}
          </Intro>

          <Newsletter
            placeholder="Get our newsletter"
            note="Join 1,000+ open source enthusiasts"
            size="md"
            buttonVariant="fancy"
            className="w-full sm:items-center"
          />
        </section>
      </div>

      <InstantSearchSSRProvider key={key} {...(serverState as InstantSearchServerState)}>
        <Search url={url} sponsoring={sponsoring} />
      </InstantSearchSSRProvider>
    </>
  )
}
