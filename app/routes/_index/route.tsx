import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import { Link, defer, useLoaderData, useLocation } from "@remix-run/react"
import { renderToString } from "react-dom/server"
import { InstantSearchSSRProvider, getServerState } from "react-instantsearch"
import { Intro } from "~/components/Intro"
import { Newsletter } from "~/components/Newsletter"
import {
  JSON_HEADERS,
  LATEST_TOOLS_TRESHOLD,
  SITE_DESCRIPTION,
  SITE_TAGLINE,
} from "~/utils/constants"
import { getMetaTags } from "~/utils/meta"
import { Search } from "./Search"
import { prisma } from "~/services.server/prisma"
import { Badge } from "~/components/Badge"
import { Ping } from "~/components/Ping"
import { ProductHuntCard } from "~/components/ProductHuntCard"
import { getCurrentPHLaunch } from "~/utils/helpers"

export const meta: MetaFunction = ({ matches }) => {
  return getMetaTags({
    title: SITE_TAGLINE,
    description: SITE_DESCRIPTION,
    parentMeta: matches.find(({ id }) => id === "root")?.meta,
  })
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  const serverState = await getServerState(<Search url={url} />, { renderToString })

  const newToolCount = await prisma.tool.count({
    where: { publishedAt: { gte: LATEST_TOOLS_TRESHOLD, lte: new Date() } },
  })

  const launch = getCurrentPHLaunch()

  return defer({ serverState, url, newToolCount, launch }, { headers: JSON_HEADERS })
}

export default function Index() {
  const { key } = useLocation()
  const { serverState, url, newToolCount, launch } = useLoaderData<typeof loader>()

  return (
    <>
      <div className="flex gap-6">
        <section className="flex flex-col gap-y-6 md:flex-1">
          <Intro
            title="Discover Open Source Alternatives to Popular Software"
            description="We’ve curated some great open source alternatives to tools that your business requires in day-to-day operations."
            className="max-w-[40rem] text-pretty"
          >
            {newToolCount && (
              <Link to="/latest" className="contents">
                <Badge className="order-first inline-flex items-center gap-1.5 px-2 py-1 rounded-md">
                  <Ping /> {newToolCount} tools added this week
                </Badge>
              </Link>
            )}
          </Intro>

          <Newsletter placeholder="Get weekly newsletter" buttonVariant="fancy" />
        </section>

        <ProductHuntCard launch={launch} className="max-md:hidden md:w-60" />
      </div>

      <InstantSearchSSRProvider key={key} {...serverState}>
        <Search url={url} />
      </InstantSearchSSRProvider>
    </>
  )
}
