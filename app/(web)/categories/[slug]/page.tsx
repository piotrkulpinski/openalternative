import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { SearchParams } from "nuqs"
import { Suspense, cache } from "react"
import { CategoryToolListing } from "~/app/(web)/categories/[slug]/listing"
import { ToolQuerySkeleton } from "~/components/web/tools/tool-query"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"
import type { CategoryOne } from "~/server/categories/payloads"
import { findCategory, findCategorySlugs } from "~/server/categories/queries"

export const revalidate = 86400 // 24 hours

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<SearchParams>
}

const getCategory = cache(async ({ params }: PageProps) => {
  const { slug } = await params
  const category = await findCategory({ where: { slug } })

  if (!category) {
    notFound()
  }

  return category
})

const getMetadata = (category: CategoryOne): Metadata => {
  const name = category.label || `${category.name} Tools`

  return {
    title: `Open Source ${name}`,
    description: `A curated collection of the ${category._count.tools} best open source ${name} for inspiration and reference. Each listing includes a website screenshot along with a detailed review of its features.`,
  }
}

export const generateStaticParams = async () => {
  const categories = await findCategorySlugs({})
  return categories.map(({ slug }) => ({ slug }))
}

export const generateMetadata = async (props: PageProps) => {
  const category = await getCategory(props)
  const url = `/categories/${category.slug}`

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
      <Intro>
        <IntroTitle>{`${title}`}</IntroTitle>
        <IntroDescription className="max-w-3xl">{description}</IntroDescription>
      </Intro>

      <Suspense fallback={<ToolQuerySkeleton />}>
        <CategoryToolListing category={category} searchParams={props.searchParams} />
      </Suspense>
    </>
  )
}