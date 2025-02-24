import type { Metadata } from "next"
import type { SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { AlternativeListing } from "~/app/(web)/alternatives/(alternatives)/listing"
import { AlternativeQuerySkeleton } from "~/components/web/alternatives/alternative-query"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"

type PageProps = {
  searchParams: Promise<SearchParams>
}

export const metadata: Metadata = {
  title: "Open Source Software Alternatives",
  description: "Discover top open source alternatives to popular proprietary software tools.",
  openGraph: { ...metadataConfig.openGraph, url: "/alternatives" },
  alternates: { ...metadataConfig.alternates, canonical: "/alternatives" },
}

export default function Alternatives({ searchParams }: PageProps) {
  return (
    <>
      <Breadcrumbs
        items={[
          {
            href: "/alternatives",
            name: "Alternatives",
          },
        ]}
      />

      <Intro>
        <IntroTitle>{`Browse ${metadata.title}`}</IntroTitle>
        <IntroDescription>{metadata.description}</IntroDescription>
      </Intro>

      <Suspense fallback={<AlternativeQuerySkeleton />}>
        <AlternativeListing searchParams={searchParams} />
      </Suspense>
    </>
  )
}
