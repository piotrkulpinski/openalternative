import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { BackButton } from "~/components/BackButton"
import { BreadcrumbsLink } from "~/components/Breadcrumbs"
import { FaviconImage } from "~/components/Favicon"
import { Grid } from "~/components/Grid"
import { Intro } from "~/components/Intro"
import { ToolRecord } from "~/components/records/ToolRecord"
import { AlternativeOne, alternativeOnePayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { JSON_HEADERS } from "~/utils/constants"
import { getMetaTags } from "~/utils/meta"

export const handle = {
  breadcrumb: (data?: { alternative: AlternativeOne }) => {
    if (!data?.alternative) return <BackButton to="/" />

    const { slug, name } = data.alternative

    return <BreadcrumbsLink to={`/alternatives/${slug}`} label={name} />
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
    const alternative = await prisma.alternative.findUniqueOrThrow({
      where: { slug },
      include: alternativeOnePayload,
    })

    const meta = {
      title: `Best Open Source ${alternative.name} Alternatives`,
      description: `A collection of the best open source ${alternative.name} alternatives. Find the best alternatives for ${alternative.name} that are open source and free to use/self-hostable.`,
    }

    return json({ meta, alternative }, JSON_HEADERS)
  } catch {
    throw json(null, { status: 404, statusText: "Not Found" })
  }
}

export default function AlternativesPage() {
  const { meta, alternative } = useLoaderData<typeof loader>()

  return (
    <>
      <Intro
        prefix={
          <FaviconImage
            src={`https://www.google.com/s2/favicons?sz=128&domain_url=${alternative.website}`}
            title={alternative.name}
          />
        }
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
            alternatives. Find the best alternatives for {alternative.name} that are open source and
            free to use/self-hostable.
          </>
        }
      />

      <Grid>
        {alternative.tools.map(({ tool }) => (
          <ToolRecord key={tool.id} tool={tool} />
        ))}

        {!alternative.tools?.length && <p>No Open Source alternatives found.</p>}
      </Grid>

      <BackButton to="/alternatives" />
    </>
  )
}
