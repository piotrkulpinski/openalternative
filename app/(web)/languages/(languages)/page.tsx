import type { Metadata } from "next"
import { Suspense } from "react"
import { LanguageListing } from "~/app/(web)/languages/(languages)/listing"
import { LanguageListSkeleton } from "~/components/web/languages/language-list"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { parseMetadata } from "~/utils/metadata"

const metadata = {
  title: "Most Popular Languages used in Open Source Software",
  description: "Browse top languages to find your best Open Source software options.",
} satisfies Metadata

export const generateMetadata = () => {
  return parseMetadata({
    ...metadata,
    alternates: { canonical: "/languages" },
    openGraph: { url: "/languages" },
  })
}

export default function Languages() {
  return (
    <>
      <Intro>
        <IntroTitle>{metadata.title}</IntroTitle>
        <IntroDescription>{metadata.description}</IntroDescription>
      </Intro>

      <Suspense fallback={<LanguageListSkeleton />}>
        <LanguageListing />
      </Suspense>
    </>
  )
}
