import type { Metadata } from "next"
import { Suspense } from "react"
import { StackListing } from "~/app/(web)/stacks/(stacks)/listing"
import { StackListSkeleton } from "~/components/web/stacks/stack-list"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"

export const metadata: Metadata = {
  title: "Browse Tech Stacks used in Open Source Software",
  description:
    "Discover top tech stacks powering popular open-source projects. Learn which technologies are trending and widely used. Perfect for expanding your skills, contributing to projects, or enhancing your own development stack.",
  openGraph: { ...metadataConfig.openGraph, url: "/stacks" },
  alternates: { ...metadataConfig.alternates, canonical: "/stacks" },
}

export default function Stacks() {
  return (
    <>
      <Intro>
        <IntroTitle>{`${metadata.title}`}</IntroTitle>
        <IntroDescription className="max-w-3xl">{metadata.description}</IntroDescription>
      </Intro>

      <Suspense fallback={<StackListSkeleton />}>
        <StackListing />
      </Suspense>
    </>
  )
}
