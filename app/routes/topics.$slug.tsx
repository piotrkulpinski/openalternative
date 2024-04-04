import { titleCase } from "@curiousleaf/utils"
import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { BackButton } from "~/components/BackButton"
import { BreadcrumbsLink } from "~/components/Breadcrumbs"
import { Grid } from "~/components/Grid"
import { Intro } from "~/components/Intro"
import { ToolRecord } from "~/components/records/ToolRecord"
import { TopicOne, topicOnePayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { JSON_HEADERS } from "~/utils/constants"
import { getMetaTags } from "~/utils/meta"

export const handle = {
  breadcrumb: (data?: { topic: TopicOne }) => {
    if (!data?.topic) return <BackButton to="/" />

    const { slug } = data.topic

    return <BreadcrumbsLink to={`/topics/${slug}`} label={titleCase(slug)} />
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
    const topic = await prisma.topic.findUniqueOrThrow({
      where: { slug },
      include: topicOnePayload,
    })

    const name = titleCase(topic.slug)

    const meta = {
      title: `Best Open Source Projects using ${name}`,
      description: `A collection of the best open source projects using ${name}. Find the best tools for ${name} that are open source and free to use/self-hostable.`,
    }

    return json({ meta, topic }, JSON_HEADERS)
  } catch {
    throw json(null, { status: 404, statusText: "Not Found" })
  }
}

export default function TopicsPage() {
  const { meta, topic } = useLoaderData<typeof loader>()

  return (
    <>
      <Intro {...meta} />

      <Grid>
        {topic.tools.map(({ tool }) => (
          <ToolRecord key={tool.id} tool={tool} />
        ))}

        {!topic.tools?.length && <p>No Open Source software found.</p>}
      </Grid>

      <BackButton to="/topics" />
    </>
  )
}
