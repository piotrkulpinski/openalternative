import type { Metadata } from "next"
import { Suspense } from "react"
import { LicenseListing } from "~/app/(web)/licenses/(licenses)/listing"
import { LicenseListSkeleton } from "~/components/web/licenses/license-list"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"

export const metadata: Metadata = {
  title: "Open Source Software Licenses",
  description:
    "Discover top open source software licenses and learn about their terms and conditions.",
  openGraph: { ...metadataConfig.openGraph, url: "/licenses" },
  alternates: { ...metadataConfig.alternates, canonical: "/licenses" },
}

export default function Licenses() {
  return (
    <>
      <Breadcrumbs
        items={[
          {
            href: "/licenses",
            name: "Licenses",
          },
        ]}
      />

      <Intro>
        <IntroTitle>{`Browse ${metadata.title}`}</IntroTitle>
        <IntroDescription>{metadata.description}</IntroDescription>
      </Intro>

      <Suspense fallback={<LicenseListSkeleton />}>
        <LicenseListing />
      </Suspense>
    </>
  )
}
