import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node"
import { typedjson, useTypedLoaderData } from "remix-typedjson"
import { BackButton } from "~/components/BackButton"
import { BreadcrumbsLink } from "~/components/Breadcrumbs"
import { Grid } from "~/components/Grid"
import { Intro } from "~/components/Intro"
import { ToolRecord } from "~/components/records/ToolRecord"
import { LanguageOne, languageOnePayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"

export const handle = {
  breadcrumb: (data?: { language: LanguageOne }) => {
    if (!data) return <BackButton to="/" />

    const { slug, name } = data.language

    return <BreadcrumbsLink to={`/languages/${slug}`} label={name} />
  },
}

export const meta: MetaFunction = () => {
  return [{ title: "OpenAlternative" }, { name: "description", content: "Welcome to Remix!" }]
}

export const loader = async ({ params: { slug } }: LoaderFunctionArgs) => {
  try {
    const language = await prisma.language.findUniqueOrThrow({
      where: { slug },
      include: languageOnePayload,
    })

    return typedjson({ language })
  } catch {
    throw json(null, { status: 404, statusText: "Not Found" })
  }
}

export default function LanguagesPage() {
  const { language } = useTypedLoaderData<typeof loader>()

  return (
    <>
      <Intro
        title={`Best ${language.name} Open Source Projects`}
        description={` A collection of the best open source software tools written in ${language.name}. Find the most popular and trending open source projects to learn from, contribute to, or use in your own projects.`}
      />

      <Grid>
        {language.tools.map((tool) => (
          <ToolRecord key={tool.id} tool={tool} />
        ))}

        {!language.tools?.length && <p>No Open Source software found.</p>}
      </Grid>

      <BackButton to="/languages" />
    </>
  )
}
