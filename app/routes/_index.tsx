import { Prisma } from "@prisma/client"
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import { Link } from "@remix-run/react"
import { BlocksIcon, BracesIcon, TagIcon } from "lucide-react"
import { typedjson, useTypedLoaderData } from "remix-typedjson"
import { Button } from "~/components/Button"
import { Filters } from "~/components/Filters"
import { Grid } from "~/components/Grid"
import { Intro } from "~/components/Intro"
import { Newsletter } from "~/components/Newsletter"
import { Series } from "~/components/Series"
import { ToolRecord } from "~/components/records/ToolRecord"
import { toolManyPayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { SITE_TAGLINE } from "~/utils/constants"

export const meta: MetaFunction = () => {
  return [{ title: "OpenAlternative" }, { name: "description", content: "Welcome to Remix!" }]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const order = new URL(request.url).searchParams.get("order")
  let orderBy: Prisma.ToolOrderByWithRelationInput

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

  const tools = await prisma.tool.findMany({
    where: { isDraft: false },
    orderBy: [{ isFeatured: "desc" }, orderBy],
    include: toolManyPayload,
  })

  return typedjson({ tools })
}

export default function Index() {
  const { tools } = useTypedLoaderData<typeof loader>()

  return (
    <>
      <section className="flex flex-col gap-y-6 sm:items-start sm:text-start">
        <Intro
          title={SITE_TAGLINE}
          description="We’ve curated some great open source alternatives to tools that your business requires in day-to-day operations."
          className="items-start text-pretty"
        />

        <Newsletter placeholder="Get weekly newsletter" buttonVariant="fancy" />
      </section>

      <Grid>
        <div className="col-span-full flex items-center justify-between">
          <Series>
            <Button size="md" variant="secondary" prefix={<BlocksIcon />} asChild>
              <Link to="/categories">Browse by Category</Link>
            </Button>
            <Button size="md" variant="secondary" prefix={<BracesIcon />} asChild>
              <Link to="/languages">Browse by Language</Link>
            </Button>
            <Button size="md" variant="secondary" prefix={<TagIcon />} asChild>
              <Link to="/topics">Browse by Topic</Link>
            </Button>
          </Series>

          <Filters />
        </div>

        {tools.map((tool) => (
          <ToolRecord key={tool.id} tool={tool} />
        ))}
      </Grid>
    </>
  )
}
