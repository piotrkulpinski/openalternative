import { lcFirst } from "@curiousleaf/utils"
import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import type { SearchParams } from "nuqs/server"
import { Suspense, cache } from "react"
import { CategoryToolListing } from "~/app/(web)/categories/[...slug]/listing"
import { ToolQuerySkeleton } from "~/components/web/tools/tool-query"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"
import { categoryRedirects } from "~/lib/categories"
import type { CategoryOne } from "~/server/web/categories/payloads"
import {
  findCategoryByPath,
  findCategorySlugs,
  findCategoryTree,
} from "~/server/web/categories/queries"

type PageProps = {
  params: Promise<{ slug: string[] }>
  searchParams: Promise<SearchParams>
}

const getCategory = cache(async ({ params }: PageProps) => {
  const { slug } = await params
  const category = await findCategoryByPath(slug.join("/"))

  if (!category) {
    const categoryRedirect = categoryRedirects.find(c => c.source === slug.join("/"))

    if (categoryRedirect) {
      const url = `/categories/${categoryRedirect.destination}`
      permanentRedirect(url)
    }

    notFound()
  }

  return category
})

const getMetadata = (category: CategoryOne): Metadata => {
  const name = category.label || `${category.name} Tools`

  return {
    title: `Open Source ${name}`,
    description: `A curated collection of the best free and open source ${lcFirst(category.description ?? "")}`,
  }
}

export const generateStaticParams = async () => {
  const categories = await findCategorySlugs({})
  return categories.map(({ fullPath }) => ({ slug: fullPath.split("/") }))
}

export const generateMetadata = async (props: PageProps) => {
  const category = await getCategory(props)
  const url = `/categories/${category.fullPath}`

  return {
    ...getMetadata(category),
    alternates: { ...metadataConfig.alternates, canonical: url },
    openGraph: { ...metadataConfig.openGraph, url },
  }
}

export default async function CategoryPage(props: PageProps) {
  const category = await getCategory(props)
  const categoryTree = await findCategoryTree(category.fullPath)
  const { title, description } = getMetadata(category)

  const breadcrumbItems = [
    {
      href: "/categories",
      name: "Categories",
    },
    ...categoryTree.map(cat => ({
      href: `/categories/${cat.fullPath}`,
      name: cat.label || cat.name,
    })),
  ]

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />

      <Intro>
        <IntroTitle>{`${title}`}</IntroTitle>
        <IntroDescription className="max-w-2xl">{description}</IntroDescription>
      </Intro>

      <Suspense fallback={<ToolQuerySkeleton />}>
        <CategoryToolListing category={category} searchParams={props.searchParams} />
      </Suspense>
    </>
  )
}
