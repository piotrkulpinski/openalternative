import type { MetaFunction } from "@remix-run/node"
import plur from "plur"
import { typedjson, useTypedLoaderData } from "remix-typedjson"
import { CardSimple } from "~/components/CardSimple"
import { Grid } from "~/components/Grid"
import { Intro } from "~/components/Intro"
import { categoryManyPayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { JSON_HEADERS, JSON_HEADERS } from "~/utils/constants"

export const meta: MetaFunction = () => {
  return [{ title: "OpenAlternative" }, { name: "description", content: "Welcome to Remix!" }]
}

export const loader = async () => {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: categoryManyPayload,
  })

  return typedjson({ categories }, JSON_HEADERS)
}

export default function CategoriesIndex() {
  const { categories } = useTypedLoaderData<typeof loader>()

  return (
    <>
      <Intro
        title="Open Source Software Categories"
        description="Browse top categories to find your best Open Source software options."
      />

      <Grid className="md:gap-8">
        {categories.map((category) => (
          <CardSimple
            key={category.id}
            to={`/categories/${category.slug}`}
            label={category.name}
            caption={`${category.tools.length} ${plur("tool", category.tools.length)}`}
          />
        ))}
      </Grid>
    </>
  )
}
