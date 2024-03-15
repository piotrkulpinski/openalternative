import { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache } from "react"
import { Grid } from "~/components/Grid"
import { Intro } from "~/components/Intro"
import { ToolCard } from "~/components/cards/ToolCard"
import { getAlternativeQuery, getAlternativesQuery } from "~/queries/alternatives"
import { Tool } from "~/queries/tools"
import { getClient } from "~/services/apollo"
import { convertTextToLink } from "~/utils/helpers"
import { parseMetadata } from "~/utils/metadata"

export const dynamicParams = false

type PageParams = { params: { slug: string } }

// Getters
const getAlternative = cache(async (slug: string) => {
  const { data } = await getClient().query({
    query: getAlternativeQuery,
    variables: { slug },
  })

  if (!data.alternatives?.[0]) {
    return notFound()
  }

  return data.alternatives?.[0]
})

const getMetadata = cache((name: string | null, metadata?: Metadata) => ({
  ...metadata,
  title: `Best Open Source ${name} Alternatives`,
  description: `A collection of the best open source ${name} alternatives. Find the best alternatives for ${name} that are open source.`,
}))

// Static Params
export const generateStaticParams = async () => {
  const { data } = await getClient().query({
    query: getAlternativesQuery,
  })

  return data.alternatives?.map((alternative) => ({ slug: alternative?.slug })) ?? []
}

// Dynamic Metadata
export const generateMetadata = async ({ params: { slug } }: PageParams): Promise<Metadata> => {
  const alternative = await getAlternative(slug)
  const url = `/alternatives-to/${slug}`

  const metadata = getMetadata(alternative.name, {
    alternates: { canonical: url },
    openGraph: { url },
  })

  return parseMetadata(metadata)
}

// Component
export default async function AlternativePage({ params: { slug } }: PageParams) {
  const alternative = await getAlternative(slug)
  const metadata = getMetadata(alternative.name)

  return (
    <>
      <Intro
        title={metadata.title}
        description={convertTextToLink(metadata.description, alternative.name, alternative.website)}
      />

      <Grid>
        {alternative.tools?.map((tool) => <ToolCard key={tool?.id} tool={tool as Tool} />)}
        {!alternative.tools?.length && <p>No alternatives found.</p>}
      </Grid>
    </>
  )
}
