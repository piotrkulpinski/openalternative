import type { MetaFunction } from "@remix-run/node"
import { typedjson, useTypedLoaderData } from "remix-typedjson"
import { Card } from "~/components/Card"
import { Grid } from "~/components/Grid"
import { Intro } from "~/components/Intro"
import { alternativeManyPayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"

export const meta: MetaFunction = () => {
  return [{ title: "OpenAlternative" }, { name: "description", content: "Welcome to Remix!" }]
}

export const loader = async () => {
  const alternatives = await prisma.alternative.findMany({
    orderBy: { name: "asc" },
    include: alternativeManyPayload,
  })

  return typedjson({ alternatives })
}

export default function Index() {
  const { alternatives } = useTypedLoaderData<typeof loader>()

  return (
    <>
      <Intro
        title="Open Source Software Alternatives"
        description="Browse top alternatives to find your best Open Source software tools."
      />

      <Grid>
        {alternatives.map((alternative) => (
          <Card
            key={alternative.id}
            to={`/alternatives/${alternative.slug}`}
            name={alternative.name}
            description={alternative.description}
            website={alternative.website}
          />
        ))}
      </Grid>
    </>
  )
}
