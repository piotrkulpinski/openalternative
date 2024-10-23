import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import { json, useLoaderData, useLocation } from "@remix-run/react"
import { subDays } from "date-fns"
import { renderToString } from "react-dom/server"
import { getServerState } from "react-instantsearch"
import { AlternativeList } from "~/components/alternative-list"
import { Hero } from "~/components/hero"
import { alternativeManyPayload } from "~/services.server/api"
import { getUserPrefs } from "~/services.server/cookies"
import { prisma } from "~/services.server/prisma"
import { FEATURED_ALTERNATIVES, SITE_DESCRIPTION, SITE_TAGLINE } from "~/utils/constants"
import { getMetaTags } from "~/utils/meta"
import { Search } from "./search"

export const shouldRevalidate = () => {
  return false
}

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
  const userPrefs = await getUserPrefs(request)

  const [sponsoring, newToolsCount, alternatives, serverState] = await Promise.all([
    // Find sponsoring
    prisma.sponsoring.findFirst({
      where: { startsAt: { lte: new Date() }, endsAt: { gt: new Date() } },
      select: { name: true, description: true, website: true, faviconUrl: true },
    }),

    // Find tool count
    prisma.tool.count({
      where: { publishedAt: { gte: subDays(new Date(), 7), lte: new Date() } },
    }),

    // Find alternatives
    prisma.alternative.findMany({
      where: { slug: { in: FEATURED_ALTERNATIVES }, NOT: { tools: { none: {} } } },
      include: alternativeManyPayload,
      take: 6,
    }),

    // Algolia server state
    getServerState(<Search url={url} sponsoring={null} />, { renderToString }),
  ])

  return json({ url, sponsoring, alternatives, newToolsCount, serverState, ...userPrefs })
}

export default function Index() {
  const { key } = useLocation()

  const { url, sponsoring, alternatives, newToolsCount, serverState, hideNewsletter } =
    useLoaderData<typeof loader>()

  return (
    <>
      <Hero toolCount={newToolsCount} hideNewsletter={hideNewsletter} />

      <Search key={key} serverState={serverState} url={url} sponsoring={sponsoring} />

      <AlternativeList alternatives={alternatives} />
    </>
  )
}
