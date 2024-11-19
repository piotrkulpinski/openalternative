import { Prisma } from "@prisma/client"

export const categoryOnePayload = Prisma.validator<Prisma.CategoryInclude>()({
  _count: { select: { tools: { where: { tool: { publishedAt: { lte: new Date() } } } } } },
})

export const categoryManyPayload = Prisma.validator<Prisma.CategoryInclude>()({
  _count: { select: { tools: { where: { tool: { publishedAt: { lte: new Date() } } } } } },
})

export type CategoryOne = Prisma.CategoryGetPayload<{ include: typeof categoryOnePayload }>
export type CategoryMany = Prisma.CategoryGetPayload<{ include: typeof categoryManyPayload }>
