import { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache } from "react"
import { Grid } from "~/components/Grid"
import { Intro } from "~/components/Intro"
import { ToolCard } from "~/components/cards/ToolCard"
import { getLanguageQuery, getLanguagesQuery } from "~/queries/languages"
import { Tool } from "~/queries/tools"
import { getClient } from "~/services/apollo"
import { parseMetadata } from "~/utils/metadata"

export const dynamicParams = false

type PageParams = { params: { slug: string } }

// Getters
const getLanguage = cache(async (slug: string) => {
  const { data } = await getClient().query({
    query: getLanguageQuery,
    variables: { slug },
  })

  if (!data.languages?.[0]) {
    return notFound()
  }

  return data.languages?.[0]
})

const getMetadata = cache((name: string | null, metadata?: Metadata) => ({
  ...metadata,
  title: `Best Open Source ${name} Software`,
  description: `A collection of the best open source software tools written in ${name}. Find the most popular and trending open source projects to learn from, contribute to, or use in your own projects.`,
}))

// Dynamic Metadata
export const generateMetadata = async ({ params: { slug } }: PageParams): Promise<Metadata> => {
  const language = await getLanguage(slug)
  const url = `/language/${slug}`

  const metadata = getMetadata(language.name, {
    alternates: { canonical: url },
    openGraph: { url },
  })

  return parseMetadata(metadata)
}

// Static Params
export const generateStaticParams = async () => {
  const { data } = await getClient().query({
    query: getLanguagesQuery,
  })

  return data.languages?.map((language) => ({ slug: language?.slug })) ?? []
}

// Component
export default async function LanguagePage({ params: { slug } }: PageParams) {
  const language = await getLanguage(slug)
  const metadata = getMetadata(language.name)

  return (
    <>
      <Intro title={metadata.title} description={metadata.description} />

      <Grid>
        {language.tools?.map((tool) => <ToolCard key={tool?.id} tool={tool as Tool} />)}
        {!language.tools?.length && <p>No software found.</p>}
      </Grid>
    </>
  )
}
