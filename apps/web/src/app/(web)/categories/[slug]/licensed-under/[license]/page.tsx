import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { SearchParams } from "nuqs/server"
import { Suspense, cache } from "react"
import { CategoryToolListing } from "~/app/(web)/categories/[slug]/licensed-under/[license]/listing"
import { ToolQuerySkeleton } from "~/components/web/tools/tool-query"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"
import type { CategoryOne } from "~/server/web/categories/payloads"
import { findCategoryBySlug } from "~/server/web/categories/queries"
import type { LicenseOne } from "~/server/web/licenses/payloads"
import { findLicenseBySlug } from "~/server/web/licenses/queries"

type PageProps = {
  params: Promise<{ slug: string; license: string }>
  searchParams: Promise<SearchParams>
}

const getCategory = cache(async ({ params }: PageProps) => {
  const { slug: categorySlug, license: licenseSlug } = await params
  const [category, license] = await Promise.all([
    findCategoryBySlug(categorySlug),
    findLicenseBySlug(licenseSlug),
  ])

  if (!category || !license) {
    notFound()
  }

  return { category, license }
})

const getMetadata = (category: CategoryOne, license: LicenseOne): Metadata => {
  const name = category.label || `${category.name} Tools`

  return {
    title: `Open Source ${name} licensed under ${license.name}`,
    description: `A curated collection of the best open source ${name} licensed under ${license.name}. Each listing includes a website screenshot along with a detailed review of its features.`,
  }
}

export const generateMetadata = async (props: PageProps) => {
  const { category, license } = await getCategory(props)
  const url = `/categories/${category.slug}/licensed-under/${license.slug}`

  return {
    ...getMetadata(category, license),
    alternates: { ...metadataConfig.alternates, canonical: url },
    openGraph: { ...metadataConfig.openGraph, url },
  }
}

export default async function CategoryPage(props: PageProps) {
  const { category, license } = await getCategory(props)
  const { title, description } = getMetadata(category, license)

  return (
    <>
      <Breadcrumbs
        items={[
          {
            href: "/categories",
            name: "Categories",
          },
          {
            href: `/categories/${category.slug}`,
            name: category.label || category.name,
          },
          {
            href: `/categories/${category.slug}/licensed-under/${license.slug}`,
            name: `Licensed under ${license.name}`,
          },
        ]}
      />

      <Intro>
        <IntroTitle>{`${title}`}</IntroTitle>
        <IntroDescription className="max-w-3xl">{description}</IntroDescription>
      </Intro>

      <Suspense fallback={<ToolQuerySkeleton />}>
        <CategoryToolListing
          category={category}
          license={license}
          searchParams={props.searchParams}
        />
      </Suspense>
    </>
  )
}
