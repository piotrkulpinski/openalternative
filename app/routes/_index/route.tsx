import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import { json, useLoaderData, useLocation } from "@remix-run/react"
import { renderToString } from "react-dom/server"
import {
  InstantSearchSSRProvider,
  type InstantSearchServerState,
  getServerState,
} from "react-instantsearch"
import { AlternativeList } from "~/partials/AlternativeList"
import { Hero } from "~/partials/Hero"
import { Search } from "~/routes/_index/Search"
import { alternativeManyPayload } from "~/services.server/api"
import { getPostHogFlagValue } from "~/services.server/posthog"
import { prisma } from "~/services.server/prisma"
import {
  FEATURED_ALTERNATIVES,
  LATEST_TOOLS_TRESHOLD,
  SITE_DESCRIPTION,
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

  const [sponsoring, newToolCount, alternatives, newsletterFlag] = await Promise.all([
    // Find sponsoring
    prisma.sponsoring.findFirst({
      where: { startsAt: { lte: new Date() }, endsAt: { gt: new Date() } },
      select: { name: true, description: true, website: true, faviconUrl: true },
    }),

    // Find tool count
    prisma.tool.count({
      where: { publishedAt: { gte: LATEST_TOOLS_TRESHOLD, lte: new Date() } },
    }),

    // Find alternatives
    prisma.alternative.findMany({
      where: { slug: { in: FEATURED_ALTERNATIVES } },
      include: alternativeManyPayload,
      take: 6,
    }),

    // Get newsletter test value
    getPostHogFlagValue(request, "newsletter-conversion"),
  ])

  const serverState = await getServerState(<Search url={url} sponsoring={sponsoring} />, {
    renderToString,
  })

  return json({ url, sponsoring, alternatives, newToolCount, serverState, newsletterFlag })
}

export default function Index() {
  const { key } = useLocation()

  const { url, sponsoring, alternatives, newToolCount, serverState, newsletterFlag } =
    useLoaderData<typeof loader>()

  return (
    <>
      <Hero toolCount={newToolCount} flag={newsletterFlag} />

      <InstantSearchSSRProvider key={key} {...(serverState as InstantSearchServerState)}>
        <Search url={url} sponsoring={sponsoring} />
      </InstantSearchSSRProvider>

      <AlternativeList alternatives={alternatives} />
    </>
  )
}
