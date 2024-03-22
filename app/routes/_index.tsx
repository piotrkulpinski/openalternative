import { Prisma } from "@prisma/client"
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import { typedjson, useTypedLoaderData } from "remix-typedjson"
import { Featured } from "~/components/Featured"
import { Filters } from "~/components/Filters"
import { Grid } from "~/components/Grid"
import { Intro } from "~/components/Intro"
import { Newsletter } from "~/components/Newsletter"
import { ToolRecord } from "~/components/records/ToolRecord"
import { toolManyPayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"

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
      <section className="flex flex-col gap-y-6 sm:items-center sm:text-center">
        <Intro
          title="Discover Open Source Alternatives to Popular Software."
          description="We’ve curated some great open source alternatives to tools that your business requires in day-to-day operations."
          className="items-center text-balance"
        />

        <Newsletter placeholder="Get weekly newsletter" />

        <Featured />
      </section>

      <Grid>
        <Filters className="col-span-full" />

        {tools.map((tool) => (
          <ToolRecord key={tool.id} tool={tool} />
        ))}
      </Grid>
    </>
  )
}
