import { Prisma } from "@prisma/client"

export const topicOnePayload = Prisma.validator<Prisma.TopicInclude>()({
  _count: { select: { tools: { where: { tool: { status: "Published" } } } } },
})

export const topicManyPayload = Prisma.validator<Prisma.TopicInclude>()({
  _count: { select: { tools: { where: { tool: { status: "Published" } } } } },
})

export type TopicOne = Prisma.TopicGetPayload<{ include: typeof topicOnePayload }>
export type TopicMany = Prisma.TopicGetPayload<{ include: typeof topicManyPayload }>
