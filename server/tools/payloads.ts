import { Prisma } from "@prisma/client"

export const toolOnePayload = Prisma.validator<Prisma.ToolInclude>()({
  license: true,
})

export const toolManyPayload = Prisma.validator<Prisma.ToolInclude>()({})

export type ToolOne = Prisma.ToolGetPayload<{ include: typeof toolOnePayload }>
export type ToolMany = Prisma.ToolGetPayload<{ include: typeof toolManyPayload }>
