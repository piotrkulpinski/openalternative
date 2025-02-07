import { db } from "@openalternative/db"
import { type Prisma, ToolStatus } from "@openalternative/db/client"
import { unstable_cacheTag as cacheTag } from "next/cache"
import { topicManyPayload, topicOnePayload } from "~/server/web/topics/payloads"

export const findTopics = async ({ where, orderBy, ...args }: Prisma.TopicFindManyArgs) => {
  "use cache"

  cacheTag("topics")

  return db.topic.findMany({
    ...args,
    orderBy: orderBy ?? [{ tools: { _count: "desc" } }, { slug: "asc" }],
    where: { tools: { some: { status: ToolStatus.Published } }, ...where },
    select: topicManyPayload,
  })
}

export const findTopicSlugs = async ({ where, orderBy, ...args }: Prisma.TopicFindManyArgs) => {
  "use cache"

  cacheTag("topics")

  return db.topic.findMany({
    ...args,
    orderBy: orderBy ?? { slug: "asc" },
    where: { tools: { some: { status: ToolStatus.Published } }, ...where },
    select: { slug: true, updatedAt: true },
  })
}

export const findTopic = async ({ where, ...args }: Prisma.TopicFindFirstArgs = {}) => {
  "use cache"

  cacheTag("topic", `topic-${where?.slug}`)

  return db.topic.findFirst({
    ...args,
    where,
    select: topicOnePayload,
  })
}
