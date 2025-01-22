import type { Metadata } from "next"
import type { SearchParams } from "nuqs/server"
import { Suspense } from "react"
import { SelfHostedToolListing } from "~/app/(web)/self-hosted/listing"
import { ToolQuerySkeleton } from "~/components/web/tools/tool-query"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"

type PageProps = {
  searchParams: Promise<SearchParams>
}

export const metadata: Metadata = {
  title: "Self-hosted Alternatives to Popular Software",
  description:
    "Self-hosting involves running and managing applications on your own server(s) rather than utilizing SaaS providers. Below is a list of services and web applications that can be hosted on your own server(s).",
  openGraph: { ...metadataConfig.openGraph, url: "/self-hosted" },
  alternates: { ...metadataConfig.alternates, canonical: "/self-hosted" },
}

export default function SelfHosted({ searchParams }: PageProps) {
  return (
    <>
      <Intro>
        <IntroTitle>{`${metadata.title}`}</IntroTitle>
        <IntroDescription>{metadata.description}</IntroDescription>
      </Intro>

      <Suspense fallback={<ToolQuerySkeleton />}>
        <SelfHostedToolListing searchParams={searchParams} />
      </Suspense>
    </>
  )
}
