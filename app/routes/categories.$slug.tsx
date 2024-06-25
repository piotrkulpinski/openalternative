import { type LoaderFunctionArgs, type MetaFunction, json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { BackButton } from "~/components/BackButton"
import { BreadcrumbsLink } from "~/components/Breadcrumbs"
import { Grid } from "~/components/Grid"
import { Intro } from "~/components/Intro"
import { ToolRecord } from "~/components/records/ToolRecord"
import { type CategoryOne, categoryOnePayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { JSON_HEADERS } from "~/utils/constants"
import { getMetaTags } from "~/utils/meta"

export const handle = {
  breadcrumb: (data?: { category: CategoryOne }) => {
    if (!data?.category) return <BackButton to="/" />

    const { slug, name } = data.category

    return <BreadcrumbsLink to={`/categories/${slug}`} label={name} />
  },
}

export const meta: MetaFunction<typeof loader> = ({ matches, data, location }) => {
  const { title, description } = data?.meta || {}

  return getMetaTags({
    location,
    title,
    description,
    parentMeta: matches.find(({ id }) => id === "root")?.meta,
  })
}

export const loader = async ({ params: { slug } }: LoaderFunctionArgs) => {
  try {
    const category = await prisma.category.findUniqueOrThrow({
      where: { slug },
      include: categoryOnePayload,
    })

    const meta = {
      title: `Best Open Source ${category.name} Software`,
      description: `A collection of the best open source ${category.name} tools. Find the best tools for ${category.name} that are open source and free to use/self-hostable.`,
    }

    return json({ meta, category }, { headers: JSON_HEADERS })
  } catch {
    throw json(null, { status: 404, statusText: "Not Found" })
  }
}

export default function CategoriesPage() {
  const { meta, category } = useLoaderData<typeof loader>()

  return (
    <>
      <Intro {...meta} />

      <Grid>
        {category.tools.map(({ tool }) => (
          <ToolRecord key={tool.id} tool={tool} />
        ))}

        {!category.tools?.length && <p className="col-span-full">No Open Source software found.</p>}
      </Grid>

      <BackButton to="/categories" />
    </>
  )
}
