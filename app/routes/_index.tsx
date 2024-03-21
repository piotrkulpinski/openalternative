import type { MetaFunction } from "@remix-run/node"
import { typedjson, useTypedLoaderData } from "remix-typedjson"
import { Featured } from "~/components/Featured"
import { Grid } from "~/components/Grid"
import { Intro } from "~/components/Intro"
import { ToolRecord } from "~/components/records/ToolRecord"
import { toolManyPayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"

export const meta: MetaFunction = () => {
  return [{ title: "OpenAlternative" }, { name: "description", content: "Welcome to Remix!" }]
}

export const loader = async () => {
  const tools = await prisma.tool.findMany({
    where: { isDraft: false },
    orderBy: [{ isFeatured: "desc" }, { score: "desc" }],
    include: toolManyPayload,
  })

  return typedjson({ tools })
}

export default function Index() {
  const { tools } = useTypedLoaderData<typeof loader>()

  return (
    <>
      <section className="flex flex-col items-start gap-y-6">
        <Intro
          title="Discover Open Source Alternatives to Popular Software."
          description="We’ve curated some great open source alternatives to tools that your business requires in day-to-day operations."
        />

        <Featured />
      </section>

      <Grid>
        {tools.map((tool) => (
          <ToolRecord key={tool.id} tool={tool} />
        ))}
      </Grid>
    </>
  )
}
