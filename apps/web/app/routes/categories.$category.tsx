import { type LoaderFunctionArgs, type MetaFunction, json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { ToolRecord } from "~/components/records/tool-record"
import { BackButton } from "~/components/ui/back-button"
import { BreadcrumbsLink } from "~/components/ui/breadcrumbs"
import { Grid } from "~/components/ui/grid"
import { Intro } from "~/components/ui/intro"
import { type CategoryOne, categoryOnePayload, toolManyPayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { JSON_HEADERS } from "~/utils/constants"
import { getMetaTags } from "~/utils/meta"

export const handle = {
  breadcrumb: (data?: { category: CategoryOne }) => {
    if (!data?.category) return <BackButton to="/categories" />

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

export const loader = async ({ params: { category: slug } }: LoaderFunctionArgs) => {
  try {
    const [category, tools] = await Promise.all([
      prisma.category.findUniqueOrThrow({
        where: { slug },
        include: categoryOnePayload,
      }),

      prisma.tool.findMany({
        where: {
          categories: { some: { category: { slug } } },
          publishedAt: { lte: new Date() },
        },
        include: toolManyPayload,
        orderBy: [{ isFeatured: "desc" }, { score: "desc" }],
      }),
    ])

    const name = category.label || `${category.name} Tools`

    const meta = {
      title: `Open Source ${name}`,
      description: `A curated collection of the ${tools.length} best open source ${name} for inspiration and reference. Each listing includes a website screenshot along with a detailed review of its features.`,
    }

    return json({ meta, category, tools }, { headers: { ...JSON_HEADERS } })
  } catch (error) {
    console.error(error)
    throw json(null, { status: 404, statusText: "Not Found" })
  }
}

export default function CategoriesPage() {
  const { meta, tools } = useLoaderData<typeof loader>()

  return (
    <>
      <Intro {...meta} />

      <Grid>
        {tools.map(tool => (
          <ToolRecord key={tool.id} tool={tool} />
        ))}

        {!tools?.length && <p className="col-span-full">No Open Source software found.</p>}
      </Grid>

      <BackButton to="/categories" />
    </>
  )
}
