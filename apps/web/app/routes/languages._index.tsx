import type { MetaFunction } from "@remix-run/node"
import { json, useLoaderData } from "@remix-run/react"
import { LanguageRecord } from "~/components/records/language-record"
import { Grid } from "~/components/ui/grid"
import { Intro } from "~/components/ui/intro"
import { languageManyPayload } from "~/services.server/api"
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
  const languages = await prisma.language.findMany({
    where: { tools: { some: { tool: { publishedAt: { lte: new Date() } } } } },
    orderBy: [{ tools: { _count: "desc" } }, { name: "asc" }],
    include: languageManyPayload,
  })

  const meta = {
    title: "Most Popular Languages used in Open Source Software",
    description: "Browse top languages to find your best Open Source software options.",
  }

  return json({ meta, languages }, { headers: JSON_HEADERS })
}

export default function LanguagesIndex() {
  const { meta, languages } = useLoaderData<typeof loader>()

  return (
    <>
      <Intro {...meta} />

      <Grid className="md:gap-8">
        {languages.map(language => (
          <LanguageRecord key={language.slug} language={language} />
        ))}

        {!languages.length && <p className="col-span-full">No languages found.</p>}
      </Grid>
    </>
  )
}
