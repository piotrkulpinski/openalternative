import type { MetaFunction } from "@remix-run/node"
import { typedjson, useTypedLoaderData } from "remix-typedjson"
import { Intro } from "~/components/Intro"
import { CategoryRecord } from "~/components/records/CategoryRecord"
import { categoryManyPayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"

export const meta: MetaFunction = () => {
  return [{ title: "OpenAlternative" }, { name: "description", content: "Welcome to Remix!" }]
}

export const loader = async () => {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: categoryManyPayload,
  })

  return typedjson({ categories })
}

export default function Index() {
  const { categories } = useTypedLoaderData<typeof loader>()

  return (
    <>
      <Intro
        title="Open Source Software Categories"
        description="Browse top categories to find your best Open Source software options."
      />

      <div className="grid grid-cols-3 gap-8">
        {categories.map((category) => (
          <CategoryRecord key={category.id} category={category} />
        ))}
      </div>
    </>
  )
}
