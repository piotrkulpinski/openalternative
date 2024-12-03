import { type Prisma, ToolStatus } from "@prisma/client"
import { unstable_cacheTag as cacheTag } from "next/cache"
import { topicManyPayload, topicOnePayload } from "~/server/web/topics/payloads"
import { prisma } from "~/services/prisma"

export const findTopics = async ({ where, orderBy, ...args }: Prisma.TopicFindManyArgs) => {
  "use cache"
  cacheTag("topics")

  return prisma.topic.findMany({
    ...args,
    orderBy: orderBy ?? [{ tools: { _count: "desc" } }, { slug: "asc" }],
    where: { tools: { some: { tool: { status: ToolStatus.Published } } }, ...where },
    include: topicManyPayload,
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

export const findTopicBySlug = async (
  slug: string,
  { where, ...args }: Prisma.TopicFindFirstArgs,
) => {
  "use cache"
  cacheTag(`topic-${slug}`)

  return prisma.topic.findFirst({
    ...args,
    where: { slug, ...where },
    include: topicOnePayload,
  })
}
