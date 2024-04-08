import { ClientOnly } from "remix-utils/client-only"
import type { MetaFunction } from "@remix-run/node"
import { NavLink, useSearchParams } from "@remix-run/react"
import { BlocksIcon, BracesIcon, TagIcon } from "lucide-react"
import { Button } from "~/components/Button"
import { Intro } from "~/components/Intro"
import { Newsletter } from "~/components/Newsletter"
import { Series } from "~/components/Series"
import { SITE_DESCRIPTION, SITE_TAGLINE } from "~/utils/constants"
import { getMetaTags } from "~/utils/meta"
import { Listing } from "./Listing"
import { useEffect, useRef } from "react"
import { ToolsContext, ToolsStore, createToolsStore, toolsSearchParamsSchema } from "~/store/tools"
import { Filters } from "./Filters"

export const meta: MetaFunction = ({ matches }) => {
  return getMetaTags({
    title: SITE_TAGLINE,
    description: SITE_DESCRIPTION,
    parentMeta: matches.find(({ id }) => id === "root")?.meta,
  })
}

export default function Index() {
  const [searchParams] = useSearchParams()

  console.log(searchParams.getAll("language"))
  const storeRef = useRef<ToolsStore>()
  const toolsSearchParams = toolsSearchParamsSchema.parse({
    language: searchParams.getAll("language"),
    topic: searchParams.getAll("topic"),
    alternative: searchParams.getAll("alternative"),
  })

  if (!storeRef.current) {
    // Store is created once and reused across renders
    storeRef.current = createToolsStore(toolsSearchParams)
  }

  useEffect(() => {
    const toolsState = storeRef.current?.getState()
    toolsState?.setSearchParams(toolsSearchParams)
  }, [toolsSearchParams])

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

      <ClientOnly fallback={null}>{() => <Filters className="-mb-6 self-start" />}</ClientOnly>

      <Listing />

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
    </ToolsContext.Provider>
  )
}
