import { titleCase } from "@curiousleaf/utils"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { SearchParams } from "nuqs/server"
import { Suspense, cache } from "react"
import { TopicToolListing } from "~/app/(web)/topics/[slug]/listing"
import { ToolQuerySkeleton } from "~/components/web/tools/tool-query"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"
import type { TopicOne } from "~/server/topics/payloads"
import { findTopic, findTopicSlugs } from "~/server/topics/queries"

export const revalidate = 86400 // 24 hours

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<SearchParams>
}

const getTopic = cache(async ({ params }: PageProps) => {
  const { slug } = await params
  const topic = await findTopic({ where: { slug } })

  if (!topic) {
    notFound()
  }

  return topic
})

const getMetadata = (topic: TopicOne): Metadata => {
  const name = titleCase(topic.slug)

  return {
    title: `Open Source Projects tagged "${name}"`,
    description: `A curated collection of the ${topic._count.tools} best open source projects tagged "${name}". Each listing includes a website screenshot along with a detailed review of its features.`,
  }
}

export const generateStaticParams = async () => {
  const topics = await findTopicSlugs({})
  return topics.map(({ slug }) => ({ slug }))
}

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const topic = await getTopic(props)
  const url = `/topics/${topic.slug}`

  return {
    ...getMetadata(topic),
    alternates: { ...metadataConfig.alternates, canonical: url },
    openGraph: { ...metadataConfig.openGraph, url },
  }
}

export default async function TopicPage(props: PageProps) {
  const topic = await getTopic(props)
  const { title, description } = getMetadata(topic)

  return (
    <>
      <Intro>
        <IntroTitle>{`${title}`}</IntroTitle>
        <IntroDescription className="max-w-3xl">{description}</IntroDescription>
      </Intro>

      <Suspense fallback={<ToolQuerySkeleton />}>
        <TopicToolListing topic={topic} searchParams={props.searchParams} />
      </Suspense>
    </>
  )
}
