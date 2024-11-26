import type { Metadata } from "next"
import { Suspense } from "react"
import { LicenseListing } from "~/app/(web)/licenses/(licenses)/listing"
import { LicenseListSkeleton } from "~/components/web/licenses/license-list"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"

export const metadata: Metadata = {
  title: "Best Open Source Software Licenses",
  description:
    "Browse top open source software licenses and learn about their terms and conditions.",
  openGraph: { ...metadataConfig.openGraph, url: "/licenses" },
  alternates: { ...metadataConfig.alternates, canonical: "/licenses" },
}

export default function Licenses() {
  return (
    <>
      <Intro>
        <IntroTitle>{`${metadata.title}`}</IntroTitle>
        <IntroDescription>{metadata.description}</IntroDescription>
      </Intro>

      <Suspense fallback={<LicenseListSkeleton />}>
        <LicenseListing />
      </Suspense>
    </>
  )
}
