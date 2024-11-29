import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { SearchParams } from "nuqs/server"
import { Suspense, cache } from "react"
import { ToolListSkeleton } from "~/components/web/tools/tool-list"
import { ToolListing } from "~/components/web/tools/tool-listing"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import type { CategoryOne } from "~/server/categories/payloads"
import { findCategory, findCategorySlugs } from "~/server/categories/queries"
import { parseMetadata } from "~/utils/metadata"

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

const getMetadata = (category: CategoryOne) => {
  const name = category.label || `${category.name} Tools`

  return {
    title: `Open Source ${name}`,
    description: `A curated collection of the ${category._count.tools} best open source ${name} for inspiration and reference. Each listing includes a website screenshot along with a detailed review of its features.`,
  } satisfies Metadata
}

export const generateStaticParams = async () => {
  const categories = await findCategorySlugs({})
  return categories.map(({ slug }) => ({ slug }))
}

export const generateMetadata = async (props: PageProps) => {
  const category = await getCategory(props)
  const url = `/categories/${category.slug}`

  return parseMetadata(
    Object.assign(getMetadata(category), {
      alternates: { canonical: url },
      openGraph: { url },
    }),
  )
}

export default async function CategoryPage(props: PageProps) {
  const category = await getCategory(props)
  const { title, description } = getMetadata(category)

  return (
    <>
      <Intro>
        <IntroTitle>{title}</IntroTitle>
        <IntroDescription className="max-w-3xl">{description}</IntroDescription>
      </Intro>

      <Suspense fallback={<ToolListSkeleton />}>
        <ToolListing
          searchParams={props.searchParams}
          where={{ categories: { some: { category: { slug: category.slug } } } }}
          placeholder={`Search ${category.label?.toLowerCase()}...`}
        />
      </Suspense>
    </>
  )
}
