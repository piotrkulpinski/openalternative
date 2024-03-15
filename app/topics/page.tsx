import { Intro } from "~/components/Intro"
import { getClient } from "~/services/apollo"
import { getTopicsQuery, type Topic } from "~/queries/topics"
import { Grid } from "~/components/Grid"
import { TopicCard } from "~/components/cards/TopicCard"
import { cache } from "react"
import { Metadata, ResolvingMetadata } from "next"
import { parseMetadata } from "~/utils/metadata"

export const dynamic = "force-static"

// Getters
const getTopics = cache(async () => {
  const { data } = await getClient().query({
    query: getTopicsQuery,
  })

  return data.topics
})

const getMetadata = cache((metadata?: Metadata) => ({
  ...metadata,
  title: "Open Source Software Topics",
  description: "Browse top topics to find your best Open Source software options.",
}))

// Dynamic Metadata
export const generateMetadata = async ({}): Promise<Metadata> => {
  const url = "/topics"

  const metadata = getMetadata({
    alternates: { canonical: url },
    openGraph: { url },
  })

  return parseMetadata(metadata)
}

// Component
export default async function Topics() {
  const topics = await getTopics()
  const metadata = getMetadata()

  return (
    <>
      <Intro title={metadata.title} description={metadata.description} />

      <Grid>{topics?.map((topic) => <TopicCard key={topic?.id} topic={topic as Topic} />)}</Grid>
    </>
  )
}
