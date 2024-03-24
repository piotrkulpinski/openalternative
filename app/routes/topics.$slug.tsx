import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node"
import { typedjson, useTypedLoaderData } from "remix-typedjson"
import { BackButton } from "~/components/BackButton"
import { BreadcrumbsLink } from "~/components/Breadcrumbs"
import { Grid } from "~/components/Grid"
import { Intro } from "~/components/Intro"
import { ToolRecord } from "~/components/records/ToolRecord"
import { TopicOne, topicOnePayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { JSON_HEADERS } from "~/utils/constants"

export const handle = {
  breadcrumb: (data?: { topic: TopicOne }) => {
    if (!data) return <BackButton to="/" />

    const { slug, name } = data.topic

    return <BreadcrumbsLink to={`/topics/${slug}`} label={name} />
  },
}

export const meta: MetaFunction = () => {
  return [{ title: "OpenAlternative" }, { name: "description", content: "Welcome to Remix!" }]
}

export const loader = async ({ params: { slug } }: LoaderFunctionArgs) => {
  try {
    const topic = await prisma.topic.findUniqueOrThrow({
      where: { slug },
      include: topicOnePayload,
    })

    return typedjson({ topic }, JSON_HEADERS)
  } catch {
    throw json(null, { status: 404, statusText: "Not Found" })
  }
}

export default function TopicsPage() {
  const { topic } = useTypedLoaderData<typeof loader>()

  return (
    <>
      <Intro
        title={`Best Open Source Projects using ${topic.name}`}
        description={`A collection of the best open source projects using ${topic.name}. Find the best tools for ${topic.name} that are open source and free to use.`}
      />

      <Grid>
        {topic.tools.map((tool) => (
          <ToolRecord key={tool.id} tool={tool} />
        ))}

        {!topic.tools?.length && <p>No Open Source software found.</p>}
      </Grid>

      <BackButton to="/topics" />
    </>
  )
}
