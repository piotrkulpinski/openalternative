import { db } from "@openalternative/db"
import { type Prisma, ToolStatus } from "@openalternative/db/client"
import { cache } from "~/lib/cache"
import { topicManyPayload, topicOnePayload } from "~/server/web/topics/payloads"

export const findTopics = cache(
  async ({ where, orderBy, ...args }: Prisma.TopicFindManyArgs) => {
    return db.topic.findMany({
      ...args,
      orderBy: orderBy ?? [{ tools: { _count: "desc" } }, { slug: "asc" }],
      where: { tools: { some: { status: ToolStatus.Published } }, ...where },
      select: topicManyPayload,
    })
  },
  ["topics"],
)

export const findTopicSlugs = async ({ where, orderBy, ...args }: Prisma.TopicFindManyArgs) => {
  return db.topic.findMany({
    ...args,
    orderBy: orderBy ?? { slug: "asc" },
    where: { tools: { some: { status: ToolStatus.Published } }, ...where },
    select: { slug: true, updatedAt: true },
  })
}

export const findTopicBySlug = (slug: string, { where, ...args }: Prisma.TopicFindFirstArgs = {}) =>
  cache(
    async (slug: string) => {
      return db.topic.findFirst({
        ...args,
        where: { slug, ...where },
        select: topicOnePayload,
      })
    },
    ["topic", `topic-${slug}`],
  )(slug)
