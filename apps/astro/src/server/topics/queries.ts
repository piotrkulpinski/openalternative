import { prisma } from "@openalternative/db"
import { type Prisma, ToolStatus } from "@openalternative/db/client"
import { topicManyPayload, topicOnePayload } from "~/server/topics/payloads"

export const findTopics = async ({ where, orderBy, ...args }: Prisma.TopicFindManyArgs) => {
  return prisma.topic.findMany({
    ...args,
    orderBy: orderBy ?? [{ tools: { _count: "desc" } }, { slug: "asc" }],
    where: { tools: { some: { tool: { status: ToolStatus.Published } } }, ...where },
    select: topicManyPayload,
  })
}

export const findTopicSlugs = async ({ where, orderBy, ...args }: Prisma.TopicFindManyArgs) => {
  return prisma.topic.findMany({
    ...args,
    orderBy: orderBy ?? { slug: "asc" },
    where: { tools: { some: { tool: { status: ToolStatus.Published } } }, ...where },
    select: { slug: true, updatedAt: true },
  })
}

export const findTopicBySlug = (
  slug: string,
  { where, ...args }: Prisma.TopicFindFirstArgs = {},
) => {
  return prisma.topic.findFirst({
    ...args,
    where: { slug, ...where },
    select: topicOnePayload,
  })
}
