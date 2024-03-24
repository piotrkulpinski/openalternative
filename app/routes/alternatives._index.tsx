import { MetaFunction, json, useLoaderData } from "@remix-run/react"
import { Grid } from "~/components/Grid"
import { Intro } from "~/components/Intro"
import { AlternativeRecord } from "~/components/records/AlternativeRecord"
import { alternativeManyPayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const { title, description } = data?.meta || {}

  return [{ title }, { name: "description", content: description }]
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

  return json({ meta, alternatives })
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
      </Grid>
    </>
  )
}
