import { titleCase } from "@curiousleaf/utils"
import { type LoaderFunctionArgs, type MetaFunction, json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { ToolRecord } from "~/components/records/tool-record"
import { BackButton } from "~/components/ui/back-button"
import { BreadcrumbsLink } from "~/components/ui/breadcrumbs"
import { Grid } from "~/components/ui/grid"
import { Intro } from "~/components/ui/intro"
import { type TopicOne, toolManyPayload, topicOnePayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { JSON_HEADERS } from "~/utils/constants"
import { getMetaTags } from "~/utils/meta"

export const handle = {
  breadcrumb: (data?: { topic: TopicOne }) => {
    if (!data?.topic) return <BackButton to="/topics" />

    const { slug } = data.topic

    return <BreadcrumbsLink to={`/topics/${slug}`} label={titleCase(slug)} />
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

export const loader = async ({ params: { topic: slug } }: LoaderFunctionArgs) => {
  try {
    const [topic, tools] = await Promise.all([
      prisma.topic.findUniqueOrThrow({
        where: { slug },
        include: topicOnePayload,
      }),

      prisma.tool.findMany({
        where: {
          topics: { some: { topic: { slug } } },
          publishedAt: { lte: new Date() },
        },
        include: toolManyPayload,
        orderBy: [{ isFeatured: "desc" }, { score: "desc" }],
      }),
    ])

    const name = titleCase(topic.slug)

    const meta = {
      title: `Open Source Projects tagged "${name}"`,
      description: `A curated collection of the ${tools.length} best open source projects tagged "${name}". Each listing includes a website screenshot along with a detailed review of its features.`,
    }

    return json({ meta, topic, tools }, { headers: { ...JSON_HEADERS } })
  } catch (error) {
    console.error(error)
    throw json(null, { status: 404, statusText: "Not Found" })
  }
}

export default function TopicsPage() {
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

      <BackButton to="/topics" />
    </>
  )
}
