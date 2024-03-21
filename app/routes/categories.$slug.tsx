import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node"
import { typedjson, useTypedLoaderData } from "remix-typedjson"
import { Grid } from "~/components/Grid"
import { Intro } from "~/components/Intro"
import { ToolRecord } from "~/components/records/ToolRecord"
import { categoryOnePayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"

export const meta: MetaFunction = () => {
  return [{ title: "OpenAlternative" }, { name: "description", content: "Welcome to Remix!" }]
}

export const loader = async ({ params: { slug } }: LoaderFunctionArgs) => {
  try {
    const category = await prisma.category.findUniqueOrThrow({
      where: { slug },
      include: categoryOnePayload,
    })

    return typedjson({ category })
  } catch {
    throw json(null, { status: 404, statusText: "Not Found" })
  }
}

export default function TopicPage() {
  const { category } = useTypedLoaderData<typeof loader>()

  return (
    <>
      <Intro
        title={`Best Open Source ${category.name} Tools`}
        description={`A collection of the best open source ${category.name} tools. Find the best tools for ${category.name} that are open source and free to use.`}
      />

      <Grid>
        {category.tools.map((tool) => (
          <ToolRecord key={tool.id} tool={tool} />
        ))}

        {!category.tools?.length && <p>No tools found.</p>}
      </Grid>
    </>
  )
}
