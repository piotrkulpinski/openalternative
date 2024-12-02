import { Prisma } from "@prisma/client"

export const alternativeOnePayload = Prisma.validator<Prisma.AlternativeInclude>()({
  _count: { select: { tools: { where: { tool: { status: "Published" } } } } },
})

export const alternativeManyPayload = Prisma.validator<Prisma.AlternativeInclude>()({
  _count: { select: { tools: { where: { tool: { status: "Published" } } } } },
})

export type AlternativeOne = Prisma.AlternativeGetPayload<{ include: typeof alternativeOnePayload }>
export type AlternativeMany = Prisma.AlternativeGetPayload<{
  include: typeof alternativeManyPayload
}>
