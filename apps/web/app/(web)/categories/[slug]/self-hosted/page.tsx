import { lcFirst } from "@curiousleaf/utils"
import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import type { SearchParams } from "nuqs/server"
import { Suspense, cache } from "react"
import { CategoryToolListing } from "~/app/(web)/categories/[slug]/self-hosted/listing"
import { ToolQuerySkeleton } from "~/components/web/tools/tool-query"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"
import { categoryRedirects } from "~/lib/categories"
import type { CategoryOne } from "~/server/web/categories/payloads"
import { findCategoryBySlug, findCategorySlugs } from "~/server/web/categories/queries"

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<SearchParams>
}

const getCategory = cache(async ({ params }: PageProps) => {
  const { slug } = await params
  const category = await findCategoryBySlug(slug)

  if (!category) {
    const categoryRedirect = categoryRedirects.find(c => c.source === slug)

    if (categoryRedirect) {
      const url = `/categories/${categoryRedirect.destination.split("/").pop()}/self-hosted`
      permanentRedirect(url)
    }

    notFound()
  }

  return category
})

const getMetadata = (category: CategoryOne): Metadata => {
  const name = category.label || `${category.name} Tools`

  return {
    title: `Best Self-hosted ${name}`,
    description: `A curated collection of the best self-hosted ${lcFirst(category.description ?? "")}`,
  }
}

export const generateStaticParams = async () => {
  const categories = await findCategorySlugs({})
  return categories.map(({ slug }) => ({ slug }))
}

export const generateMetadata = async (props: PageProps) => {
  const category = await getCategory(props)
  const url = `/categories/${category.slug}/self-hosted`

  return {
    ...getMetadata(category),
    alternates: { ...metadataConfig.alternates, canonical: url },
    openGraph: { ...metadataConfig.openGraph, url },
  }
}

export default async function CategoryPage(props: PageProps) {
  const category = await getCategory(props)
  const { title, description } = getMetadata(category)

  return (
    <>
      <Breadcrumbs
        items={[
          {
            href: "/categories",
            name: "Categories",
          },
          {
            href: `/categories/${category.fullPath}`,
            name: category.label || category.name,
          },
          {
            href: `/categories/${category.slug}/self-hosted`,
            name: "Self-hosted Tools",
          },
        ]}
      />

      <Intro>
        <IntroTitle className="max-w-4xl">{`${title}`}</IntroTitle>
        <IntroDescription className="max-w-2xl">{description}</IntroDescription>
      </Intro>

      <Suspense fallback={<ToolQuerySkeleton />}>
        <CategoryToolListing category={category} searchParams={props.searchParams} />
      </Suspense>
    </>
  )
}
