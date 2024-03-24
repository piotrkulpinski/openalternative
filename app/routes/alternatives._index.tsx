import type { MetaFunction } from "@remix-run/node"
import { typedjson, useTypedLoaderData } from "remix-typedjson"
import { Grid } from "~/components/Grid"
import { Intro } from "~/components/Intro"
import { AlternativeRecord } from "~/components/records/AlternativeRecord"
import { alternativeManyPayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { JSON_HEADERS } from "~/utils/constants"

export const meta: MetaFunction = () => {
  return [{ title: "OpenAlternative" }, { name: "description", content: "Welcome to Remix!" }]
}

export const loader = async () => {
  const alternatives = await prisma.alternative.findMany({
    orderBy: { name: "asc" },
    include: alternativeManyPayload,
  })

  return typedjson({ alternatives }, JSON_HEADERS)
}

export default function AlternativesIndex() {
  const { alternatives } = useTypedLoaderData<typeof loader>()

  return (
    <>
      <Intro
        title="Open Source Software Alternatives"
        description="Browse top alternatives to find your best Open Source software tools."
      />

      <Grid>
        {alternatives.map((alternative) => (
          <AlternativeRecord key={alternative.id} alternative={alternative} showCount />
        ))}
      </Grid>
    </>
  )
}
