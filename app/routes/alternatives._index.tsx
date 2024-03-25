import { MetaFunction, json, useLoaderData } from "@remix-run/react"
import { Grid } from "~/components/Grid"
import { Intro } from "~/components/Intro"
import { AlternativeRecord } from "~/components/records/AlternativeRecord"
import { alternativeManyPayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { JSON_HEADERS } from "~/utils/constants"
import { getMetaTags } from "~/utils/meta"

export const meta: MetaFunction<typeof loader> = ({ matches, data }) => {
  const { title, description } = data?.meta || {}

  return getMetaTags({
    title,
    description,
    parentMeta: matches.find(({ id }) => id === "root")?.meta,
  })
}

export const loader = async () => {
  const alternatives = await prisma.alternative.findMany({
    orderBy: { name: "asc" },
    include: alternativeManyPayload,
  })

  const meta = {
    title: "Open Source Software Alternatives",
    description: "Browse top alternatives to find your best Open Source software tools.",
  }

  return json({ meta, alternatives }, JSON_HEADERS)
}

export default function AlternativesIndex() {
  const { meta, alternatives } = useLoaderData<typeof loader>()

  return (
    <>
      <Intro {...meta} />

      <Grid>
        {alternatives.map((alternative) => (
          <AlternativeRecord key={alternative.id} alternative={alternative} showCount />
        ))}

        {!alternatives.length && <p>No alternatives found.</p>}
      </Grid>
    </>
  )
}
