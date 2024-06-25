import { getPageParams } from "@curiousleaf/utils"
import {
  type HeadersFunction,
  type LoaderFunctionArgs,
  type MetaFunction,
  json,
} from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { Grid } from "~/components/Grid"
import { Intro } from "~/components/Intro"
import { Pagination } from "~/components/Pagination"
import { TopicRecord } from "~/components/records/TopicRecord"
import { topicManyPayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { JSON_HEADERS, TOPICS_PER_PAGE } from "~/utils/constants"
import { getMetaTags } from "~/utils/meta"
import { combineServerTimings, makeTimings, time } from "~/utils/timing.server"

export const meta: MetaFunction<typeof loader> = ({ matches, data, location }) => {
  const { title, description } = data?.meta || {}

  return getMetaTags({
    location,
    title,
    description,
    parentMeta: matches.find(({ id }) => id === "root")?.meta,
  })
}

export const headers: HeadersFunction = ({ loaderHeaders, parentHeaders }) => {
  return {
    "Server-Timing": combineServerTimings(parentHeaders, loaderHeaders),
  }
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const timings = makeTimings("tool loader")
  const { take, skip } = getPageParams(request, TOPICS_PER_PAGE)

  const [topics, topicCount] = await Promise.all([
    time(
      () =>
        prisma.topic.findMany({
          orderBy: { slug: "asc" },
          include: topicManyPayload,
          take,
          skip,
        }),
      { type: "find topics", timings },
    ),
    time(() => prisma.topic.count(), { type: "count topics", timings }),
  ])

  const meta = {
    title: "Open Source Software Topics",
    description: "Browse top topics to find your best Open Source software options.",
  }

  return json(
    { meta, topics, topicCount },
    { headers: { "Server-Timing": timings.toString(), ...JSON_HEADERS } },
  )
}

export default function TopicsIndex() {
  const { meta, topics, topicCount } = useLoaderData<typeof loader>()

  return (
    <>
      <Intro {...meta} />

      <Grid className="md:gap-8">
        {topics.map(topic => (
          <TopicRecord key={topic.slug} topic={topic} />
        ))}

        {!topics.length && <p className="col-span-full">No topics found.</p>}
      </Grid>

      <Pagination totalCount={topicCount} pageSize={TOPICS_PER_PAGE} />
    </>
  )
}
