import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node"
import { typedjson, useTypedLoaderData } from "remix-typedjson"
import { BackButton } from "~/components/BackButton"
import { BreadcrumbsLink } from "~/components/Breadcrumbs"
import { FaviconImage } from "~/components/Favicon"
import { Grid } from "~/components/Grid"
import { Intro } from "~/components/Intro"
import { ToolRecord } from "~/components/records/ToolRecord"
import { AlternativeOne, alternativeOnePayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { JSON_HEADERS } from "~/utils/constants"

export const handle = {
  breadcrumb: (data?: { alternative: AlternativeOne }) => {
    if (!data) return <BackButton to="/" />

    const { slug, name } = data.alternative

    return <BreadcrumbsLink to={`/alternatives/${slug}`} label={name} />
  },
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const { title, description } = data?.meta || {}

  return [{ title }, { name: "description", content: description }]
}

export const loader = async ({ params: { slug } }: LoaderFunctionArgs) => {
  try {
    const alternative = await prisma.alternative.findUniqueOrThrow({
      where: { slug },
      include: alternativeOnePayload,
    })

    const meta = {
      title: `Best Open Source ${alternative.name} Alternatives`,
      description: `A collection of the best open source ${alternative.name} tools. Find the best alternatives for ${alternative.name} that are open source and free to use/self-hostable.`,
    }

    return typedjson({ meta, alternative }, JSON_HEADERS)
  } catch {
    throw json(null, { status: 404, statusText: "Not Found" })
  }
}

export default function AlternativesPage() {
  const { meta, alternative } = useTypedLoaderData<typeof loader>()

  return (
    <>
      <Intro
        prefix={<FaviconImage url={alternative.website} />}
        title={meta.title}
        description={
          <>
            A collection of the best open source{" "}
            {alternative.website ? (
              <a href={alternative.website} target="_blank" rel="noopener noreferrer nofollow">
                {alternative.name}
              </a>
            ) : (
              alternative.name
            )}{" "}
            tools. Find the best alternatives for {alternative.name} that are open source and free
            to use/self-hostable.
          </>
        }
      />

      <Grid>
        {alternative.tools.map((tool) => (
          <ToolRecord key={tool.id} tool={tool} />
        ))}

        {!alternative.tools?.length && <p>No Open Source alternatives found.</p>}
      </Grid>

      <BackButton to="/alternatives" />
    </>
  )
}
