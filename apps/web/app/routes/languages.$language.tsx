import { type LoaderFunctionArgs, type MetaFunction, json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { ToolRecord } from "~/components/records/tool-record"
import { BackButton } from "~/components/ui/back-button"
import { BreadcrumbsLink } from "~/components/ui/breadcrumbs"
import { Grid } from "~/components/ui/grid"
import { Intro } from "~/components/ui/intro"
import { type LanguageOne, languageOnePayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { JSON_HEADERS } from "~/utils/constants"
import { getMetaTags } from "~/utils/meta"

export const handle = {
  breadcrumb: (data?: { language: LanguageOne }) => {
    if (!data?.language) return <BackButton to="/languages" />

    const { slug, name } = data.language

    return <BreadcrumbsLink to={`/languages/${slug}`} label={name} />
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

export const loader = async ({ params: { language: slug } }: LoaderFunctionArgs) => {
  try {
    const [language, tools] = await Promise.all([
      prisma.language.findUniqueOrThrow({
        where: { slug },
        include: languageOnePayload,
      }),

      prisma.tool.findMany({
        where: {
          languages: { some: { language: { slug } } },
          publishedAt: { lte: new Date() },
        },
        orderBy: [{ isFeatured: "desc" }, { score: "desc" }],
      }),
    ])

    const meta = {
      title: `${language.name} Open Source Projects`,
      description: `A curated collection of the ${tools.length} best open source software written in ${language.name}. Find the most popular and trending open source projects to learn from, contribute to, or use in your own projects.`,
    }

    return json({ meta, language, tools }, { headers: { ...JSON_HEADERS } })
  } catch (error) {
    console.error(error)
    throw json(null, { status: 404, statusText: "Not Found" })
  }
}

export default function LanguagesPage() {
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

      <BackButton to="/languages" />
    </>
  )
}
