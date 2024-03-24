import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node"
import { typedjson, useTypedLoaderData } from "remix-typedjson"
import { BackButton } from "~/components/BackButton"
import { BreadcrumbsLink } from "~/components/Breadcrumbs"
import { Grid } from "~/components/Grid"
import { Intro } from "~/components/Intro"
import { ToolRecord } from "~/components/records/ToolRecord"
import { CategoryOne, categoryOnePayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { JSON_HEADERS } from "~/utils/constants"

export const handle = {
  breadcrumb: (data?: { category: CategoryOne }) => {
    if (!data) return <BackButton to="/" />

    const { slug, name } = data.category

    return <BreadcrumbsLink to={`/categories/${slug}`} label={name} />
  },
}

export const meta: MetaFunction = () => {
  return [{ title: "OpenAlternative" }, { name: "description", content: "Welcome to Remix!" }]
}

export const loader = async ({ params: { slug } }: LoaderFunctionArgs) => {
  try {
    const category = await prisma.category.findUniqueOrThrow({
      where: { slug },
      include: categoryOnePayload,
    })

    return typedjson({ category }, JSON_HEADERS)
  } catch {
    throw json(null, { status: 404, statusText: "Not Found" })
  }
}

export default function CategoriesPage() {
  const { category } = useTypedLoaderData<typeof loader>()

  return (
    <>
      <Intro
        title={`Best Open Source ${category.name} Tools`}
        description={`A collection of the best open source ${category.name} tools. Find the best tools for ${category.name} that are open source and free to use.`}
      />

      <Grid>
        {category.tools.map((tool) => (
          <ToolRecord key={tool.id} tool={tool} />
        ))}

        {!category.tools?.length && <p>No Open Source software found.</p>}
      </Grid>

      <BackButton to="/categories" />
    </>
  )
}
