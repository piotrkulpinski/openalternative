import { type LoaderFunctionArgs, json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { TopicRecord } from "~/components/records/topic-record"
import { BackButton } from "~/components/ui/back-button"
import { BreadcrumbsLink } from "~/components/ui/breadcrumbs"
import { Grid } from "~/components/ui/grid"
import { topicManyPayload } from "~/services.server/api"
import { prisma } from "~/services.server/prisma"
import { ALPHABET, JSON_HEADERS } from "~/utils/constants"

export const handle = {
  breadcrumb: (data?: { letter: string }) => {
    if (!data?.letter) return <BackButton to="/" />

    return (
      <BreadcrumbsLink to={`/topics/letter/${data.letter}`} label={data.letter.toUpperCase()} />
    )
  },
}

export const loader = async ({ params: { letter } }: LoaderFunctionArgs) => {
  const topics = await prisma.topic.findMany({
    where: {
      tools: { some: { tool: { publishedAt: { lte: new Date() } } } },
      ...(letter === "&"
        ? { NOT: ALPHABET.split("").map(startsWith => ({ slug: { startsWith } })) }
        : { slug: { startsWith: letter } }),
    },
    orderBy: [{ tools: { _count: "desc" } }, { slug: "asc" }],
    include: topicManyPayload,
  })

  return json({ topics, letter }, { headers: { ...JSON_HEADERS } })
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
