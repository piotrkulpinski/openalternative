import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import { typedjson, useTypedLoaderData } from "remix-typedjson"
import { Grid } from "~/components/Grid"
import { Intro } from "~/components/Intro"
import { ToolRecord } from "~/components/records/ToolRecord"
import { alternativeOnePayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"

export const meta: MetaFunction = () => {
  return [{ title: "OpenAlternative" }, { name: "description", content: "Welcome to Remix!" }]
}

export const loader = async ({ params: { slug } }: LoaderFunctionArgs) => {
  const alternative = await prisma.alternative.findUniqueOrThrow({
    where: { slug },
    include: alternativeOnePayload,
  })

  return typedjson({ alternative })
}

export default function Index() {
  const { alternative } = useTypedLoaderData<typeof loader>()

  return (
    <>
      <Intro
        title={`Best Open Source ${alternative.name} Alternatives`}
        description={
          <>
            A collection of the best open source{" "}
            {alternative.website ? (
              <a href={alternative.website} target="_blank" rel="noopener noreferrer nofollow">
                {alternative.name}
              </a>
            ) : (
              alternative.name
            )}{" "}
            tools. Find the best alternatives for {alternative.name} that are open source and free
            to use.
          </>
        }
      />

      <Grid>
        {alternative.tools.map((tool) => (
          <ToolRecord key={tool.id} tool={tool} />
        ))}
      </Grid>
    </>
  )
}
