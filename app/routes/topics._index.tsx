import { getPageParams } from "@curiousleaf/utils"
import { LoaderFunctionArgs, json, type MetaFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { Grid } from "~/components/Grid"
import { Intro } from "~/components/Intro"
import { Pagination } from "~/components/Pagination"
import { TopicRecord } from "~/components/records/TopicRecord"
import { topicManyPayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { JSON_HEADERS, TOPICS_PER_PAGE } from "~/utils/constants"
import { getMetaTags } from "~/utils/meta"

export const meta: MetaFunction<typeof loader> = ({ matches, data }) => {
  const { title, description } = data?.meta || {}

  return getMetaTags({
    title,
    description,
    parentMeta: matches.find(({ id }) => id === "root")?.meta,
  })
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { take, skip } = getPageParams(request, TOPICS_PER_PAGE)

  const [topics, topicCount] = await Promise.all([
    prisma.topic.findMany({ orderBy: { slug: "asc" }, include: topicManyPayload, take, skip }),
    prisma.topic.count(),
  ])

  const meta = {
    title: "Open Source Software Topics",
    description: "Browse top topics to find your best Open Source software options.",
  }

  return json({ meta, topics, topicCount }, JSON_HEADERS)
}

export default function TopicsIndex() {
  const { meta, topics, topicCount } = useLoaderData<typeof loader>()

  return (
    <>
      <Intro {...meta} />

      <Grid className="md:gap-8">
        {topics.map((topic) => (
          <TopicRecord key={topic.slug} topic={topic} />
        ))}

        {!topics.length && <p>No topics found.</p>}
      </Grid>

      <Pagination totalCount={topicCount} pageSize={TOPICS_PER_PAGE} />
    </>
  )
}
