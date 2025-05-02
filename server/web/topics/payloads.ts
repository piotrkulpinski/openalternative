import { Prisma, ToolStatus } from "@prisma/client"

export const topicOnePayload = Prisma.validator<Prisma.TopicSelect>()({
  slug: true,
  _count: { select: { tools: { where: { status: ToolStatus.Published } } } },
})

export const topicManyPayload = Prisma.validator<Prisma.TopicSelect>()({
  slug: true,
  _count: { select: { tools: { where: { status: ToolStatus.Published } } } },
})

export type TopicOne = Prisma.TopicGetPayload<{ select: typeof topicOnePayload }>
export type TopicMany = Prisma.TopicGetPayload<{ select: typeof topicManyPayload }>
