import { Prisma, ToolStatus } from "@prisma/client"

export const categoryOnePayload = Prisma.validator<Prisma.CategorySelect>()({
  name: true,
  slug: true,
  label: true,
  _count: { select: { tools: { where: { tool: { status: ToolStatus.Published } } } } },
})

export const categoryManyPayload = Prisma.validator<Prisma.CategorySelect>()({
  name: true,
  slug: true,
  label: true,
  _count: { select: { tools: { where: { tool: { status: ToolStatus.Published } } } } },
})

export type CategoryOne = Prisma.CategoryGetPayload<{ select: typeof categoryOnePayload }>
export type CategoryMany = Prisma.CategoryGetPayload<{ select: typeof categoryManyPayload }>
