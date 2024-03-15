import { Intro } from "~/components/Intro"
import { getClient } from "~/services/apollo"
import { getCategoriesQuery, type Category } from "~/queries/categories"
import { Grid } from "~/components/Grid"
import { CategoryCard } from "~/components/cards/CategoryCard"
import { Metadata } from "next"
import { cache } from "react"
import { parseMetadata } from "~/utils/metadata"

export const dynamic = "force-static"

// Getters
const getCategories = cache(async () => {
  const { data } = await getClient().query({
    query: getCategoriesQuery,
  })

  return data.categories
})

const getMetadata = cache((metadata?: Metadata) => ({
  ...metadata,
  title: "Open Source Software Categories",
  description: "Browse top categories to find your best Open Source software options.",
}))

// Dynamic Metadata
export const generateMetadata = async ({}): Promise<Metadata> => {
  const url = "/categories"

  const metadata = getMetadata({
    alternates: { canonical: url },
    openGraph: { url },
  })

  return parseMetadata(metadata)
}

// Component
export default async function Categories() {
  const categories = await getCategories()
  const metadata = getMetadata()

  return (
    <>
      <Intro title={metadata.title} description={metadata.description} />

      <Grid>
        {categories?.map((category) => (
          <CategoryCard key={category?.id} category={category as Category} />
        ))}
      </Grid>
    </>
  )
}
