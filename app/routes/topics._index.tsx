import { json, type MetaFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { Grid } from "~/components/Grid"
import { Intro } from "~/components/Intro"
import { TopicRecord } from "~/components/records/TopicRecord"
import { topicManyPayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { JSON_HEADERS } from "~/utils/constants"

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const { title, description } = data?.meta || {}

  return [{ title }, { name: "description", content: description }]
}

export const loader = async () => {
  const topics = await prisma.topic.findMany({
    orderBy: { name: "asc" },
    include: topicManyPayload,
  })

  const meta = {
    title: "Open Source Software Topics",
    description: "Browse top topics to find your best Open Source software options.",
  }

  return json({ meta, topics }, JSON_HEADERS)
}

export default function TopicsIndex() {
  const { meta, topics } = useLoaderData<typeof loader>()

  return (
    <>
      <Intro {...meta} />

      <Grid className="md:gap-8">
        {topics.map((topic) => (
          <TopicRecord key={topic.id} topic={topic} />
        ))}
      </Grid>
    </>
  )
}
