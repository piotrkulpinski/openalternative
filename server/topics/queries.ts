import type { Prisma } from "@prisma/client"
import { topicManyPayload, topicOnePayload } from "~/server/topics/payloads"
import { prisma } from "~/services/prisma"

export const findTopics = async ({ where, orderBy, ...args }: Prisma.TopicFindManyArgs) => {
  return prisma.topic.findMany({
    ...args,
    orderBy: orderBy ?? { tools: { _count: "desc" } },
    where: { tools: { some: { tool: { publishedAt: { lte: new Date() } } } }, ...where },
    include: topicManyPayload,
  })
}

export const findTopicSlugs = async ({ where, orderBy, ...args }: Prisma.TopicFindManyArgs) => {
  return prisma.topic.findMany({
    ...args,
    orderBy: orderBy ?? { tools: { _count: "desc" } },
    where: { tools: { some: { tool: { publishedAt: { lte: new Date() } } } }, ...where },
    select: { slug: true, updatedAt: true },
  })
}

export const findTopic = async ({ ...args }: Prisma.TopicFindUniqueArgs) => {
  return prisma.topic.findUnique({
    ...args,
    include: topicOnePayload,
  })
}
