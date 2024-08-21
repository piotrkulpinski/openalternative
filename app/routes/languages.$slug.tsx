import {
  type HeadersFunction,
  type LoaderFunctionArgs,
  type MetaFunction,
  json,
} from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { BackButton } from "~/components/BackButton"
import { BreadcrumbsLink } from "~/components/Breadcrumbs"
import { Grid } from "~/components/Grid"
import { Intro } from "~/components/Intro"
import { ToolRecord } from "~/partials/records/ToolRecord"
import { type LanguageOne, languageOnePayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { JSON_HEADERS } from "~/utils/constants"
import { getMetaTags } from "~/utils/meta"
import { combineServerTimings, makeTimings, time } from "~/utils/timing.server"

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

export const headers: HeadersFunction = ({ loaderHeaders, parentHeaders }) => {
  return {
    "Server-Timing": combineServerTimings(parentHeaders, loaderHeaders),
  }
}

export const loader = async ({ params: { slug } }: LoaderFunctionArgs) => {
  const timings = makeTimings("language loader")

  try {
    const [language, tools] = await Promise.all([
      time(
        () =>
          prisma.language.findUniqueOrThrow({
            where: { slug },
            include: languageOnePayload,
          }),
        { type: "find language", timings },
      ),

      time(
        () =>
          prisma.tool.findMany({
            where: {
              languages: { some: { language: { slug } } },
              publishedAt: { lte: new Date() },
            },
            orderBy: [{ isFeatured: "desc" }, { score: "desc" }],
          }),
        { type: "find tools", timings },
      ),
    ])

    const meta = {
      title: `${language.name} Open Source Projects`,
      description: `A curated collection of the ${tools.length} best open source software written in ${language.name}. Find the most popular and trending open source projects to learn from, contribute to, or use in your own projects.`,
    }

    return json(
      { meta, language, tools },
      { headers: { "Server-Timing": timings.toString(), ...JSON_HEADERS } },
    )
  } catch {
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
