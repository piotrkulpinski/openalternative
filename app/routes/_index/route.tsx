import type { MetaFunction } from "@remix-run/node"
import { NavLink, useSearchParams } from "@remix-run/react"
import { BlocksIcon, BracesIcon, TagIcon } from "lucide-react"
import { Button } from "~/components/Button"
import { Filters } from "~/components/Filters"
import { Intro } from "~/components/Intro"
import { Newsletter } from "~/components/Newsletter"
import { Series } from "~/components/Series"
import { SITE_DESCRIPTION, SITE_TAGLINE } from "~/utils/constants"
import { getMetaTags } from "~/utils/meta"
import { Listing } from "./Listing"
import { useRef } from "react"
import { ToolsContext, ToolsStore, createToolsStore, toolsSearchParamsSchema } from "~/store/tools"

export const meta: MetaFunction = ({ matches }) => {
  return getMetaTags({
    title: SITE_TAGLINE,
    description: SITE_DESCRIPTION,
    parentMeta: matches.find(({ id }) => id === "root")?.meta,
  })
}

export default function Index() {
  const [searchParams] = useSearchParams()
  const storeRef = useRef<ToolsStore>()
  const toolsSearchParams = toolsSearchParamsSchema.parse(Object.fromEntries(searchParams))

  // Store is created once and reused across renders
  storeRef.current = createToolsStore(toolsSearchParams)

  return (
    <ToolsContext.Provider value={storeRef.current}>
      <section className="flex flex-col gap-y-6">
        <Intro
          title="Discover Open Source Alternatives to Popular Software"
          description="We’ve curated some great open source alternatives to tools that your business requires in day-to-day operations."
          className="max-w-[40rem] text-pretty"
        />

        <Newsletter placeholder="Get weekly newsletter" buttonVariant="fancy" />
      </section>

      <div className="-mb-6 flex flex-wrap items-center justify-between gap-4">
        <Filters />

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
      </div>

      <Listing />
    </ToolsContext.Provider>
  )
}
