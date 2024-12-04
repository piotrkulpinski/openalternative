import { type Prisma, ToolStatus } from "@prisma/client"
import { cache } from "~/lib/cache"
import { topicManyPayload, topicOnePayload } from "~/server/web/topics/payloads"
import { prisma } from "~/services/prisma"

export const findTopics = cache(
  async ({ where, orderBy, ...args }: Prisma.TopicFindManyArgs) => {
    return prisma.topic.findMany({
      ...args,
      orderBy: orderBy ?? [{ tools: { _count: "desc" } }, { slug: "asc" }],
      where: { tools: { some: { tool: { status: ToolStatus.Published } } }, ...where },
      include: topicManyPayload,
    })
  },
  ["topics"],
)

export const findTopicSlugs = async ({ where, orderBy, ...args }: Prisma.TopicFindManyArgs) => {
  return prisma.topic.findMany({
    ...args,
    orderBy: orderBy ?? { slug: "asc" },
    where: { tools: { some: { tool: { status: ToolStatus.Published } } }, ...where },
    select: { slug: true, updatedAt: true },
  })
}

export const findTopicBySlug = (slug: string) =>
  cache(
    async (slug: string) => {
      return prisma.topic.findFirst({
        where: { slug },
        include: topicOnePayload,
      })
    },
    ["topic", `topic-${slug}`],
  )(slug)
