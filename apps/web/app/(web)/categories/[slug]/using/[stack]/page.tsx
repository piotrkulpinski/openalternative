import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import type { SearchParams } from "nuqs/server"
import { Suspense, cache } from "react"
import { CategoryToolListing } from "~/app/(web)/categories/[slug]/using/[stack]/listing"
import { ToolQuerySkeleton } from "~/components/web/tools/tool-query"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"
import { categoryRedirects } from "~/lib/categories"
import type { CategoryOne } from "~/server/web/categories/payloads"
import { findCategoryBySlug } from "~/server/web/categories/queries"
import type { StackOne } from "~/server/web/stacks/payloads"
import { findStackBySlug } from "~/server/web/stacks/queries"

type PageProps = {
  params: Promise<{ slug: string; stack: string }>
  searchParams: Promise<SearchParams>
}

const getCategory = cache(async ({ params }: PageProps) => {
  const { slug: categorySlug, stack: stackSlug } = await params
  const [category, stack] = await Promise.all([
    findCategoryBySlug(categorySlug),
    findStackBySlug(stackSlug),
  ])

  if (!category || !stack) {
    const categoryRedirect = categoryRedirects.find(c => c.source === categorySlug)

    if (categoryRedirect) {
      const url = `/categories/${categoryRedirect.destination.split("/").pop()}/using/${stackSlug}`
      permanentRedirect(url)
    }

    notFound()
  }

  return { category, stack }
})

const getMetadata = (category: CategoryOne, stack: StackOne): Metadata => {
  const name = category.label || `${category.name} Tools`

  return {
    title: `Open Source ${name} using ${stack.name}`,
    description: `A curated collection of the best open source ${name} using ${stack.name}. Each listing includes a website screenshot along with a detailed review of its features.`,
  }
}

export const generateMetadata = async (props: PageProps) => {
  const { category, stack } = await getCategory(props)
  const url = `/categories/${category.slug}/using/${stack.slug}`

  return {
    ...getMetadata(category, stack),
    alternates: { ...metadataConfig.alternates, canonical: url },
    openGraph: { ...metadataConfig.openGraph, url },
  }
}

export default async function CategoryPage(props: PageProps) {
  const { category, stack } = await getCategory(props)
  const { title, description } = getMetadata(category, stack)

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
            href: `/categories/${category.slug}/using/${stack.slug}`,
            name: `Using ${stack.name}`,
          },
        ]}
      />

      <Intro>
        <IntroTitle>{`${title}`}</IntroTitle>
        <IntroDescription className="max-w-3xl">{description}</IntroDescription>
      </Intro>

      <Suspense fallback={<ToolQuerySkeleton />}>
        <CategoryToolListing category={category} stack={stack} searchParams={props.searchParams} />
      </Suspense>
    </>
  )
}
