import { Prisma, ToolStatus } from "@prisma/client"

export const stackOnePayload = Prisma.validator<Prisma.StackSelect>()({
  name: true,
  slug: true,
  type: true,
  faviconUrl: true,
  _count: { select: { tools: { where: { status: ToolStatus.Published } } } },
})

export const stackManyPayload = Prisma.validator<Prisma.StackSelect>()({
  name: true,
  slug: true,
  type: true,
  description: true,
  faviconUrl: true,
  _count: { select: { tools: { where: { status: ToolStatus.Published } } } },
})

export type StackOne = Prisma.StackGetPayload<{ select: typeof stackOnePayload }>
export type StackMany = Prisma.StackGetPayload<{ select: typeof stackManyPayload }>
