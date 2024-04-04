import { getPageParams } from "@curiousleaf/utils"
import { Prisma } from "@prisma/client"
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import { Await, NavLink, defer, useLoaderData } from "@remix-run/react"
import { BlocksIcon, BracesIcon, TagIcon } from "lucide-react"
import { Suspense } from "react"
import { Button } from "~/components/Button"
import { Filters } from "~/components/Filters"
import { Grid } from "~/components/Grid"
import { Intro } from "~/components/Intro"
import { Newsletter } from "~/components/Newsletter"
import { Pagination } from "~/components/Pagination"
import { Series } from "~/components/Series"
import { ToolRecord, ToolRecordSkeleton } from "~/components/records/ToolRecord"
import { toolManyPayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { JSON_HEADERS, SITE_DESCRIPTION, SITE_TAGLINE, TOOLS_PER_PAGE } from "~/utils/constants"
import { getSearchQuery, isMobileAgent } from "~/utils/helpers"
import { getMetaTags } from "~/utils/meta"

export const meta: MetaFunction<typeof loader> = ({ matches }) => {
  return getMetaTags({
    title: SITE_TAGLINE,
    description: SITE_DESCRIPTION,
    parentMeta: matches.find(({ id }) => id === "root")?.meta,
  })
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  type Params = { query?: string; order?: string }

  const isMobile = isMobileAgent(request.headers.get("user-agent"))
  const postsPerPage = isMobile ? TOOLS_PER_PAGE / 3 : TOOLS_PER_PAGE
  const { take, skip, query, order } = getPageParams<Params>(request, postsPerPage)
  const search = getSearchQuery(query)

  let orderBy: Prisma.ToolFindManyArgs["orderBy"]

  if (search) {
    orderBy = {
      _relevance: {
        search,
        fields: ["name", "description"],
        sort: Prisma.SortOrder.desc,
      },
    }
  } else {
    switch (order) {
      case "name":
        orderBy = { name: "asc" }
        break
      case "stars":
        orderBy = { stars: "desc" }
        break
      case "forks":
        orderBy = { forks: "desc" }
        break
      case "commit":
        orderBy = { lastCommitDate: "desc" }
        break
      default:
        orderBy = { score: "desc" }
    }

    orderBy = [{ isFeatured: "desc" }, orderBy]
  }

  const where = {
    isDraft: false,
    ...(search && {
      OR: [
        { name: { search } },
        { description: { search } },
        { topics: { some: { topic: { slug: { equals: query } } } } },
        { languages: { some: { language: { slug: { equals: query } } } } },
        { alternatives: { some: { alternative: { name: { search } } } } },
      ],
    }),
  }

  const tools = Promise.resolve().then(() => {
    return prisma.tool.findMany({
      where,
      take,
      skip,
      orderBy,
      include: toolManyPayload,
    })
  })

  const toolCount = Promise.resolve().then(() => {
    return prisma.tool.count({ where })
  })

  return defer({ tools, toolCount, postsPerPage }, JSON_HEADERS)
}

export default function Index() {
  const { tools, toolCount, postsPerPage } = useLoaderData<typeof loader>()

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

      <Grid>
        <div className="col-span-full flex flex-wrap items-center justify-between gap-4">
          <Series size="sm" className="flex-nowrap max-sm:gap-1.5">
            <Button size="md" variant="secondary" prefix={<BlocksIcon />} asChild>
              <NavLink to="/categories" prefetch="intent" unstable_viewTransition>
                <span className="max-sm:hidden">Browse by Category</span>
                <span className="sm:hidden">Categories</span>
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

          <Filters />
        </div>

        <Suspense
          fallback={Array.from({ length: 9 }).map((_, i) => (
            <ToolRecordSkeleton key={i} />
          ))}
        >
          <Await resolve={tools}>
            {(tools) => (
              <>
                {tools.map((tool) => (
                  <ToolRecord key={tool.id} tool={tool} />
                ))}

                {!tools.length && <p>No tools found.</p>}
              </>
            )}
          </Await>
        </Suspense>
      </Grid>

      <Suspense>
        <Await resolve={toolCount}>
          {(toolCount) => (
            <Pagination totalCount={toolCount} pageSize={postsPerPage} className="col-span-full" />
          )}
        </Await>
      </Suspense>
    </>
  )
}
