import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import { NavLink, useLoaderData, useLocation } from "@remix-run/react"
import { renderToString } from "react-dom/server"
import { BlocksIcon, BracesIcon, TagIcon } from "lucide-react"
import { InstantSearchSSRProvider } from "react-instantsearch-hooks-web"
import { getServerState } from "react-instantsearch-hooks-server"
import { Button } from "~/components/Button"
import { Intro } from "~/components/Intro"
import { Newsletter } from "~/components/Newsletter"
import { Series } from "~/components/Series"
import { SITE_DESCRIPTION, SITE_TAGLINE } from "~/utils/constants"
import { getMetaTags } from "~/utils/meta"
import { Search } from "./Search"

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

  return { serverState, url }
}

export default function Index() {
  const { key } = useLocation()
  const { serverState, url } = useLoaderData<typeof loader>()

  return (
    <>
      <section className="flex flex-col gap-y-6">
        <Intro
          title="Discover Open Source Alternatives to Popular Software"
          description="We’ve curated some great open source alternatives to tools that your business requires in day-to-day operations."
          className="max-w-[40rem] text-pretty"
        />

        <Newsletter placeholder="Get weekly newsletter" buttonVariant="fancy" />
      </section>

      <InstantSearchSSRProvider key={key} {...serverState}>
        <Search url={url} />
      </InstantSearchSSRProvider>

      <Series size="sm" className="flex-nowrap max-sm:gap-1.5">
        <Button size="md" variant="secondary" prefix={<BlocksIcon />} asChild>
          <NavLink to="/alternatives" prefetch="intent" unstable_viewTransition>
            <span className="max-sm:hidden">Browse by Alternative</span>
            <span className="sm:hidden">Alternatives</span>
          </NavLink>
        </Button>

        <Button size="md" variant="secondary" prefix={<BracesIcon />} asChild>
          <NavLink to="/languages" prefetch="intent" unstable_viewTransition>
            <span className="max-sm:hidden">Browse by Language</span>
            <span className="sm:hidden">Languages</span>
          </NavLink>
        </Button>

        <Button size="md" variant="secondary" prefix={<TagIcon />} asChild>
          <NavLink to="/topics" prefetch="intent" unstable_viewTransition>
            <span className="max-sm:hidden">Browse by Topic</span>
            <span className="sm:hidden">Topics</span>
          </NavLink>
        </Button>
      </Series>
    </>
  )
}
