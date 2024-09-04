import { type HeadersFunction, type LoaderFunctionArgs, json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { BackButton } from "apps/web/app/components/BackButton"
import { BreadcrumbsLink } from "apps/web/app/components/Breadcrumbs"
import { Grid } from "apps/web/app/components/Grid"
import { TopicRecord } from "apps/web/app/partials/records/TopicRecord"
import { topicManyPayload } from "apps/web/app/services.server/api"
import { prisma } from "apps/web/app/services.server/prisma"
import { ALPHABET, JSON_HEADERS } from "apps/web/app/utils/constants"
import { combineServerTimings, makeTimings, time } from "apps/web/app/utils/timing.server"

export const handle = {
  breadcrumb: (data?: { letter: string }) => {
    if (!data?.letter) return <BackButton to="/" />

    return (
      <BreadcrumbsLink to={`/topics/letter/${data.letter}`} label={data.letter.toUpperCase()} />
    )
  },
}

export const headers: HeadersFunction = ({ loaderHeaders, parentHeaders }) => {
  return {
    "Server-Timing": combineServerTimings(parentHeaders, loaderHeaders),
  }
}

export const loader = async ({ params: { letter } }: LoaderFunctionArgs) => {
  const timings = makeTimings("topics loader")

  const topics = await time(
    () =>
      prisma.topic.findMany({
        where:
          letter === "&"
            ? { NOT: ALPHABET.split("").map(startsWith => ({ slug: { startsWith } })) }
            : { slug: { startsWith: letter } },
        orderBy: [{ tools: { _count: "desc" } }, { slug: "asc" }],
        include: topicManyPayload,
      }),
    { type: "find topics", timings },
  )

  return json(
    { topics, letter },
    { headers: { "Server-Timing": timings.toString(), ...JSON_HEADERS } },
  )
}

export default function TopicsIndex() {
  const { topics } = useLoaderData<typeof loader>()

  return (
    <Grid className="md:gap-8 md:min-h-48">
      {topics.map(topic => (
        <TopicRecord key={topic.slug} topic={topic} />
      ))}

      {!topics.length && <p className="col-span-full">No topics found.</p>}
    </Grid>
  )
}
