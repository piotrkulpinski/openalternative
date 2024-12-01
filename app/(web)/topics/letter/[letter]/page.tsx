import type { Metadata } from "next"
import { Suspense } from "react"
import { TopicListing } from "~/app/(web)/topics/letter/[letter]/listing"
import { LetterPicker } from "~/components/web/letter-picker"
import { TopicListSkeleton } from "~/components/web/topics/topic-list"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { config } from "~/config"
import { metadataConfig } from "~/config/metadata"

type PageProps = {
  params: Promise<{ letter: string }>
}

const metadata: Metadata = {
  title: "Open Source Software Topics",
  description: "Browse top topics to find your best Open Source software options.",
}

export const generateStaticParams = async () => {
  return `${config.site.alphabet}&`.split("").map(letter => ({ letter }))
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { letter } = await params
  const url = `/topics/letter/${letter}`

  return {
    ...metadata,
    alternates: { ...metadataConfig.alternates, canonical: url },
    openGraph: { ...metadataConfig.openGraph, url },
  }
}

export default function Topics({ params }: PageProps) {
  return (
    <>
      <Intro>
        <IntroTitle>{`${metadata.title}`}</IntroTitle>
        <IntroDescription>{metadata.description}</IntroDescription>
      </Intro>

      <LetterPicker path="/topics/letter" />

      <Suspense fallback={<TopicListSkeleton />}>
        <TopicListing params={params} />
      </Suspense>
    </>
  )
}
