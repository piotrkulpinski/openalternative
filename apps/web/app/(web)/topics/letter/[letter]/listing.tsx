import { TopicList } from "~/components/web/topics/topic-list"
import { config } from "~/config"
import { findTopics } from "~/server/web/topics/queries"

type PageProps = {
  params: Promise<{ letter: string }>
}

export const TopicListing = async ({ params }: PageProps) => {
  const { letter } = await params
  const { alphabet } = config.site

  const topics = await findTopics({
    where: !alphabet.includes(letter)
      ? { NOT: alphabet.split("").map(startsWith => ({ slug: { startsWith } })) }
      : { slug: { startsWith: letter } },
  })

  return <TopicList topics={topics} />
}
