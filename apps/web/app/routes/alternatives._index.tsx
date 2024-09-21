import { type MetaFunction, json, useLoaderData } from "@remix-run/react"
import { AlternativeRecord } from "~/components/records/alternative-record"
import { Grid } from "~/components/ui/grid"
import { Intro, IntroTitle } from "~/components/ui/intro"
import { alternativeManyPayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { JSON_HEADERS } from "~/utils/constants"
import { getMetaTags } from "~/utils/meta"

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
    where: { tools: { some: { tool: { publishedAt: { lte: new Date() } } } } },
    orderBy: [{ isFeatured: "desc" }, { name: "asc" }],
    include: alternativeManyPayload,
  })

  const meta = {
    title: "Popular Open Source Software Alternatives",
    description: "Browse top proprietary software to find your best Open Source software tools.",
  }

  return json({ meta, alternatives }, { headers: JSON_HEADERS })
}

export default function AlternativesIndex() {
  const { meta, alternatives } = useLoaderData<typeof loader>()

  const featuredAlternatives = alternatives.filter(alt => alt.isFeatured)
  const otherAlternatives = alternatives.filter(alt => !alt.isFeatured)

  return (
    <>
      <Intro {...meta} />

      <Grid>
        {featuredAlternatives.map(alternative => (
          <AlternativeRecord key={alternative.id} alternative={alternative} showCount />
        ))}

        <IntroTitle size="h2" as="h2" className="mt-8 col-span-full">
          Other Alternatives
        </IntroTitle>

        {otherAlternatives.map(alternative => (
          <AlternativeRecord key={alternative.id} alternative={alternative} showCount />
        ))}
      </Grid>

      {!alternatives.length && <p>No alternatives found.</p>}
    </>
  )
}
