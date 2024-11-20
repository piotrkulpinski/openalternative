import type { Metadata } from "next"
import type { SearchParams } from "nuqs/server"
import { Suspense, cache } from "react"
import { AlternativeListing } from "~/app/(web)/alternatives/(alternatives)/listing"
import { AlternativeListSkeleton } from "~/components/web/alternatives/alternative-list"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { parseMetadata } from "~/utils/metadata"

type PageProps = {
  searchParams: Promise<SearchParams>
}

const getMetadata = cache(
  (metadata?: Metadata): Metadata => ({
    ...metadata,
    title: "Popular Open Source Software Alternatives",
    description: "Browse top proprietary software to find your best Open Source software tools.",
  }),
)

export const metadata = parseMetadata(
  getMetadata({
    alternates: { canonical: "/alternatives" },
    openGraph: { url: "/alternatives" },
  }),
)

export default function Alternatives({ searchParams }: PageProps) {
  const { title, description } = getMetadata()

  return (
    <>
      <Intro>
        <IntroTitle>{title?.toString()}</IntroTitle>
        <IntroDescription>{description}</IntroDescription>
      </Intro>

      <Suspense fallback={<AlternativeListSkeleton />}>
        <AlternativeListing searchParams={searchParams} />
      </Suspense>
    </>
  )
}
