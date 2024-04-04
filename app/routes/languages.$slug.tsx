import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { BackButton } from "~/components/BackButton"
import { BreadcrumbsLink } from "~/components/Breadcrumbs"
import { Grid } from "~/components/Grid"
import { Intro } from "~/components/Intro"
import { ToolRecord } from "~/components/records/ToolRecord"
import { LanguageOne, languageOnePayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { JSON_HEADERS } from "~/utils/constants"
import { getMetaTags } from "~/utils/meta"

export const handle = {
  breadcrumb: (data?: { language: LanguageOne }) => {
    if (!data?.language) return <BackButton to="/" />

    const { slug, name } = data.language

    return <BreadcrumbsLink to={`/languages/${slug}`} label={name} />
  },
}

export const meta: MetaFunction<typeof loader> = ({ matches, data }) => {
  const { title, description } = data?.meta || {}

  return getMetaTags({
    title,
    description,
    parentMeta: matches.find(({ id }) => id === "root")?.meta,
  })
}

export const loader = async ({ params: { slug } }: LoaderFunctionArgs) => {
  try {
    const language = await prisma.language.findUniqueOrThrow({
      where: { slug },
      include: languageOnePayload,
    })

    const meta = {
      title: `Best ${language.name} Open Source Projects`,
      description: ` A collection of the best open source software tools written in ${language.name}. Find the most popular and trending open source projects to learn from, contribute to, or use in your own projects.`,
    }

    return json({ meta, language }, JSON_HEADERS)
  } catch {
    throw json(null, { status: 404, statusText: "Not Found" })
  }
}

export default function LanguagesPage() {
  const { meta, language } = useLoaderData<typeof loader>()

  return (
    <>
      <Intro {...meta} />

      <Grid>
        {language.tools.map(({ tool }) => (
          <ToolRecord key={tool.id} tool={tool} />
        ))}

        {!language.tools?.length && <p>No Open Source software found.</p>}
      </Grid>

      <BackButton to="/languages" />
    </>
  )
}
