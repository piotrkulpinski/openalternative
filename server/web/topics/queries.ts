import type { Prisma } from "@prisma/client"
import { topicManyPayload, topicOnePayload } from "~/server/web/topics/payloads"
import { prisma } from "~/services/prisma"

export const findTopics = async ({ where, orderBy, ...args }: Prisma.TopicFindManyArgs) => {
  "use cache"

  return prisma.topic.findMany({
    ...args,
    orderBy: orderBy ?? [{ tools: { _count: "desc" } }, { slug: "asc" }],
    where: { tools: { some: { tool: { status: "Published" } } }, ...where },
    include: topicManyPayload,
  })
}

export const findTopicSlugs = async ({ where, orderBy, ...args }: Prisma.TopicFindManyArgs) => {
  return prisma.topic.findMany({
    ...args,
    orderBy: orderBy ?? { slug: "asc" },
    where: { tools: { some: { tool: { status: "Published" } } }, ...where },
    select: { slug: true, updatedAt: true },
  })
}

export const findTopic = async ({ ...args }: Prisma.TopicFindUniqueArgs) => {
  "use cache"

  return prisma.topic.findUnique({
    ...args,
    include: topicOnePayload,
  })
}
