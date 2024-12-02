import { Prisma } from "@prisma/client"

export const categoryOnePayload = Prisma.validator<Prisma.CategoryInclude>()({
  _count: { select: { tools: { where: { tool: { status: "Published" } } } } },
})

export const categoryManyPayload = Prisma.validator<Prisma.CategoryInclude>()({
  _count: { select: { tools: { where: { tool: { status: "Published" } } } } },
})

export type CategoryOne = Prisma.CategoryGetPayload<{ include: typeof categoryOnePayload }>
export type CategoryMany = Prisma.CategoryGetPayload<{ include: typeof categoryManyPayload }>
