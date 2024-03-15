import { Grid } from "~/components/Grid"
import { Intro } from "~/components/Intro"
import { ToolCard } from "~/components/cards/ToolCard"
import { getTopicQuery, getTopicsQuery } from "~/queries/topics"
import { Tool } from "~/queries/tools"
import { getClient } from "~/services/apollo"
import { Metadata } from "next"
import { parseMetadata } from "~/utils/metadata"
import { notFound } from "next/navigation"
import { cache } from "react"

export const dynamicParams = false

type PageParams = { params: { slug: string } }

// Getters
const getTopic = cache(async (slug: string) => {
  const { data } = await getClient().query({
    query: getTopicQuery,
    variables: { slug },
  })

  if (!data.topics?.[0]) {
    return notFound()
  }

  return data.topics?.[0]
})

const getMetadata = cache((name: string | null, metadata?: Metadata) => ({
  ...metadata,
  title: `Best Open Source Software using ${name}`,
  description: `A collection of the best open source ${name} software. Find the best software for ${name} that are open source.`,
}))

// Dynamic Metadata
export const generateMetadata = async ({ params: { slug } }: PageParams): Promise<Metadata> => {
  const topic = await getTopic(slug)
  const url = `/topic/${slug}`

  const metadata = getMetadata(topic.name, {
    alternates: { canonical: url },
    openGraph: { url },
  })

  return parseMetadata(metadata)
}

// Static Params
export const generateStaticParams = async () => {
  const { data } = await getClient().query({
    query: getTopicsQuery,
  })

  return data.topics?.map((topic) => ({ slug: topic?.slug })) ?? []
}

// Component
export default async function TopicPage({ params: { slug } }: PageParams) {
  const topic = await getTopic(slug)
  const metadata = getMetadata(topic.name)

  return (
    <>
      <Intro title={metadata.title} description={metadata.description} />

      <Grid>
        {topic.tools?.map((tool) => <ToolCard key={tool?.id} tool={tool as Tool} />)}
        {!topic.tools?.length && <p>No software found.</p>}
      </Grid>
    </>
  )
}
