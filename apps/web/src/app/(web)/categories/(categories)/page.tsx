import type { Metadata } from "next"
import { Suspense } from "react"
import { CategoriesListing } from "~/app/(web)/categories/(categories)/listing"
import { CategoryListSkeleton } from "~/components/web/categories/category-list"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"

export const metadata: Metadata = {
  title: "Open Source Software Categories",
  description: "Browse top categories to find your best Open Source software options.",
}

export default function Categories() {
  return (
    <>
      <Intro>
        <IntroTitle>{`${metadata.title}`}</IntroTitle>
        <IntroDescription>{metadata.description}</IntroDescription>
      </Intro>

      <Suspense fallback={<CategoryListSkeleton />}>
        <CategoriesListing />
      </Suspense>
    </>
  )
}
