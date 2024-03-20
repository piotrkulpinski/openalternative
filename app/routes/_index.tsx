import type { MetaFunction } from "@remix-run/node"
import { typedjson, useTypedLoaderData } from "remix-typedjson"
import { Featured } from "~/components/Featured"
import { Grid } from "~/components/Grid"
import { Prose } from "~/components/Prose"
import { ToolRecord } from "~/components/records/ToolRecord"
import { prisma } from "~/services.server/prisma"

export const meta: MetaFunction = () => {
  return [{ title: "OpenAlternative" }, { name: "description", content: "Welcome to Remix!" }]
}

export const loader = async () => {
  const tools = await prisma.tool.findMany()

  return typedjson({ tools })
}

export default function Index() {
  const { tools } = useTypedLoaderData<typeof loader>()

  return (
    <>
      <section className="flex flex-col items-start gap-y-6">
        <Prose className="!max-w-lg text-pretty">
          <p className="lead">
            Discover <strong>Open Source Alternatives</strong> to Popular Software.
            <br />
            We’ve curated some great open source alternatives to tools that your business requires
            in day-to-day operations.
          </p>
        </Prose>

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
