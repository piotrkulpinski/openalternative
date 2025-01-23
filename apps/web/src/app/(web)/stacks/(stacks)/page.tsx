import type { Metadata } from "next"
import { Suspense } from "react"
import { StackListing } from "~/app/(web)/stacks/(stacks)/listing"
import { StackListSkeleton } from "~/components/web/stacks/stack-list"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"

export const metadata: Metadata = {
  title: "Tech Stacks used in Open Source Software",
  description:
    "Discover top tech stacks powering popular open-source projects. Learn which technologies are trending and widely used. Perfect for expanding your skills, contributing to projects, or enhancing your own development stack.",
  openGraph: { ...metadataConfig.openGraph, url: "/stacks" },
  alternates: { ...metadataConfig.alternates, canonical: "/stacks" },
}

export default function Stacks() {
  return (
    <>
      <Breadcrumbs
        items={[
          {
            href: "/stacks",
            name: "Tech Stacks",
          },
        ]}
      />

      <Intro>
        <IntroTitle>{`Browse ${metadata.title}`}</IntroTitle>
        <IntroDescription className="max-w-3xl">{metadata.description}</IntroDescription>
      </Intro>

      <Suspense fallback={<StackListSkeleton />}>
        <StackListing />
      </Suspense>
    </>
  )
}
