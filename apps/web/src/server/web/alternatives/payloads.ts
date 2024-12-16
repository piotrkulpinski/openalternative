import { Prisma, ToolStatus } from "@openalternative/db/client"

export const alternativeOnePayload = Prisma.validator<Prisma.AlternativeSelect>()({
  name: true,
  slug: true,
  description: true,
  website: true,
  faviconUrl: true,
  discountCode: true,
  discountAmount: true,
  _count: { select: { tools: { where: { tool: { status: ToolStatus.Published } } } } },
})

export const alternativeManyPayload = Prisma.validator<Prisma.AlternativeSelect>()({
  name: true,
  slug: true,
  description: true,
  faviconUrl: true,
  _count: { select: { tools: { where: { tool: { status: ToolStatus.Published } } } } },
})

export type AlternativeOne = Prisma.AlternativeGetPayload<{ select: typeof alternativeOnePayload }>
export type AlternativeMany = Prisma.AlternativeGetPayload<{
  select: typeof alternativeManyPayload
}>
