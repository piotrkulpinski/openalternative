import { type MetaFunction, json, useLoaderData } from "@remix-run/react"
import { Grid } from "apps/web/app/components/Grid"
import { Intro } from "apps/web/app/components/Intro"
import { AlternativeRecord } from "apps/web/app/partials/records/AlternativeRecord"
import { alternativeManyPayload } from "apps/web/app/services.server/api"
import { prisma } from "apps/web/app/services.server/prisma"
import { JSON_HEADERS } from "apps/web/app/utils/constants"
import { getMetaTags } from "apps/web/app/utils/meta"

export const meta: MetaFunction<typeof loader> = ({ matches, data, location }) => {
  const { title, description } = data?.meta || {}

  return getMetaTags({
    location,
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

  return json({ meta, alternatives }, { headers: JSON_HEADERS })
}

export default function AlternativesIndex() {
  const { meta, alternatives } = useLoaderData<typeof loader>()

  return (
    <>
      <Intro {...meta} />

      <Grid>
        {alternatives.map(alternative => (
          <AlternativeRecord key={alternative.id} alternative={alternative} showCount />
        ))}

        {!alternatives.length && <p className="col-span-full">No alternatives found.</p>}
      </Grid>
    </>
  )
}
