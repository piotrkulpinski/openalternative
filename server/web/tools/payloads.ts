import { Prisma } from "@prisma/client"

export const toolOnePayload = Prisma.validator<Prisma.ToolInclude>()({
  license: true,
  alternatives: {
    include: { alternative: true },
    orderBy: [{ alternative: { tools: { _count: "desc" } } }, { alternative: { name: "asc" } }],
  },
  categories: {
    include: { category: true },
    orderBy: { category: { name: "asc" } },
  },
  languages: {
    include: { language: true },
    orderBy: [{ percentage: "desc" }],
  },
  topics: {
    include: { topic: true },
    orderBy: { topic: { slug: "asc" } },
  },
})

export const toolManyPayload = Prisma.validator<Prisma.ToolInclude>()({})

export type ToolOne = Prisma.ToolGetPayload<{ include: typeof toolOnePayload }>
export type ToolMany = Prisma.ToolGetPayload<{ include: typeof toolManyPayload }>
