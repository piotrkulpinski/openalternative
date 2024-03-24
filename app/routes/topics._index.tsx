import type { MetaFunction } from "@remix-run/node"
import { typedjson, useTypedLoaderData } from "remix-typedjson"
import { Grid } from "~/components/Grid"
import { Intro } from "~/components/Intro"
import { TopicRecord } from "~/components/records/TopicRecord"
import { topicManyPayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { JSON_HEADERS } from "~/utils/constants"

export const meta: MetaFunction = () => {
  return [{ title: "OpenAlternative" }, { name: "description", content: "Welcome to Remix!" }]
}

export const loader = async () => {
  const topics = await prisma.topic.findMany({
    orderBy: { name: "asc" },
    include: topicManyPayload,
  })

  return typedjson({ topics }, JSON_HEADERS)
}

export default function TopicsIndex() {
  const { topics } = useTypedLoaderData<typeof loader>()

  return (
    <>
      <Intro
        title="Open Source Software Topics"
        description="Browse top topics to find your best Open Source software options."
      />

      <Grid className="md:gap-8">
        {topics.map((topic) => (
          <TopicRecord key={topic.id} topic={topic} />
        ))}
      </Grid>
    </>
  )
}
