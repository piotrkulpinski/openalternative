import type { Metadata } from "next"
import { Suspense } from "react"
import { CategoryListing } from "~/app/(web)/categories/(categories)/listing"
import { CategoryListSkeleton } from "~/components/web/categories/category-list"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { parseMetadata } from "~/utils/metadata"

const metadata = {
  title: "Open Source Software Categories",
  description: "Browse top categories to find your best Open Source software options.",
} satisfies Metadata

export const generateMetadata = () => {
  return parseMetadata({
    ...metadata,
    alternates: { canonical: "/categories" },
    openGraph: { url: "/categories" },
  })
}

export default function Categories() {
  return (
    <>
      <Intro>
        <IntroTitle>{metadata.title}</IntroTitle>
        <IntroDescription>{metadata.description}</IntroDescription>
      </Intro>

      <Suspense fallback={<CategoryListSkeleton />}>
        <CategoryListing />
      </Suspense>
    </>
  )
}
