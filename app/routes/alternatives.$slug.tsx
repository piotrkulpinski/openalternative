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

export const handle = {
  Breadcrumb: ({ alternative }: { alternative: AlternativeOne }) => (
    <BreadcrumbsLink to={`/alternatives/${alternative.slug}`} label={alternative.name} />
  ),
}

export const meta: MetaFunction = () => {
  return [{ title: "OpenAlternative" }, { name: "description", content: "Welcome to Remix!" }]
}

export const loader = async ({ params: { slug } }: LoaderFunctionArgs) => {
  try {
    const alternative = await prisma.alternative.findUniqueOrThrow({
      where: { slug },
      include: alternativeOnePayload,
    })

    return typedjson({ alternative })
  } catch {
    throw json(null, { status: 404, statusText: "Not Found" })
  }
}

export default function AlternativesPage() {
  const { alternative } = useTypedLoaderData<typeof loader>()

  return (
    <>
      <Intro
        prefix={<FaviconImage url={alternative.website} />}
        title={`Best Open Source ${alternative.name} Alternatives`}
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
            to use.
          </>
        }
      />

      <Grid>
        {alternative.tools.map((tool) => (
          <ToolRecord key={tool.id} tool={tool} />
        ))}

        {!alternative.tools?.length && <p>No alternatives found.</p>}
      </Grid>

      <BackButton to="/alternatives" />
    </>
  )
}
