import type { Metadata } from "next"
import { Suspense } from "react"
import { LicenseListing } from "~/app/(web)/licenses/(licenses)/listing"
import { LicenseListSkeleton } from "~/components/web/licenses/license-list"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { parseMetadata } from "~/utils/metadata"

const metadata = {
  title: "Best Open Source Software Licenses",
  description:
    "Browse top open source software licenses and learn about their terms and conditions.",
} satisfies Metadata

export const generateMetadata = () => {
  return parseMetadata({
    ...metadata,
    alternates: { canonical: "/licenses" },
    openGraph: { url: "/licenses" },
  })
}

export default function Licenses() {
  return (
    <>
      <Intro>
        <IntroTitle>{metadata.title}</IntroTitle>
        <IntroDescription>{metadata.description}</IntroDescription>
      </Intro>

      <Suspense fallback={<LicenseListSkeleton />}>
        <LicenseListing />
      </Suspense>
    </>
  )
}
