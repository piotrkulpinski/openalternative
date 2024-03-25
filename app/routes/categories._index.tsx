import { json, type MetaFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { Grid } from "~/components/Grid"
import { Intro } from "~/components/Intro"
import { CategoryRecord } from "~/components/records/CategoryRecord"
import { categoryManyPayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { JSON_HEADERS } from "~/utils/constants"
import { getMetaTags } from "~/utils/meta"

export const meta: MetaFunction<typeof loader> = ({ matches, data }) => {
  const { title, description } = data?.meta || {}

  return getMetaTags({
    title,
    description,
    parentMeta: matches.find(({ id }) => id === "root")?.meta,
  })
}

export const loader = async () => {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: categoryManyPayload,
  })

  const meta = {
    title: "Open Source Software Categories",
    description: "Browse top categories to find your best Open Source software options.",
  }

  return json({ meta, categories }, JSON_HEADERS)
}

export default function CategoriesIndex() {
  const { meta, categories } = useLoaderData<typeof loader>()

  return (
    <>
      <Intro {...meta} />

      <Grid className="md:gap-8">
        {categories.map((category) => (
          <CategoryRecord key={category.id} category={category} />
        ))}

        {!categories.length && <p>No categories found.</p>}
      </Grid>
    </>
  )
}
