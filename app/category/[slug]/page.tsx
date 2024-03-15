import { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache } from "react"
import { Grid } from "~/components/Grid"
import { Intro } from "~/components/Intro"
import { ToolCard } from "~/components/cards/ToolCard"
import { getCategoryQuery, getCategoriesQuery } from "~/queries/categories"
import { Tool } from "~/queries/tools"
import { getClient } from "~/services/apollo"
import { parseMetadata } from "~/utils/metadata"

export const dynamicParams = false

type PageParams = { params: { slug: string } }

// Getters
const getCategory = cache(async (slug: string) => {
  const { data } = await getClient().query({
    query: getCategoryQuery,
    variables: { slug },
  })

  if (!data.categories?.[0]) {
    return notFound()
  }

  return data.categories?.[0]
})

const getMetadata = cache((name: string | null, metadata?: Metadata) => ({
  ...metadata,
  title: `Best Open Source ${name} Software`,
  description: `A collection of the best open source ${name} software. Find the best software for ${name} that are open source.`,
}))

// Dynamic Metadata
export const generateMetadata = async ({ params: { slug } }: PageParams): Promise<Metadata> => {
  const category = await getCategory(slug)
  const url = `/category/${slug}`

  const metadata = getMetadata(category.name, {
    alternates: { canonical: url },
    openGraph: { url },
  })

  return parseMetadata(metadata)
}

// Static Params
export const generateStaticParams = async () => {
  const { data } = await getClient().query({
    query: getCategoriesQuery,
  })

  return data.categories?.map((category) => ({ slug: category?.slug })) ?? []
}

// Component
export default async function CategoryPage({ params: { slug } }: PageParams) {
  const category = await getCategory(slug)
  const metadata = getMetadata(category.name)

  return (
    <>
      <Intro title={metadata.title} description={metadata.description} />

      <Grid>
        {category.tools?.map((tool) => <ToolCard key={tool?.id} tool={tool as Tool} />)}
        {!category.tools?.length && <p>No software found.</p>}
      </Grid>
    </>
  )
}
