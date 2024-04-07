import { Prisma } from "@prisma/client"

// Alternatives
export const alternativeOnePayload = Prisma.validator<Prisma.AlternativeInclude>()({
  tools: {
    where: { tool: { isDraft: false } },
    include: { tool: true },
    orderBy: [{ tool: { isFeatured: "desc" } }, { tool: { score: "desc" } }],
  },
})

export const alternativeManyPayload = Prisma.validator<Prisma.AlternativeInclude>()({
  _count: { select: { tools: { where: { tool: { isDraft: false } } } } },
})

export type AlternativeOne = Prisma.AlternativeGetPayload<{ include: typeof alternativeOnePayload }>
export type AlternativeMany = Prisma.AlternativeGetPayload<{
  include: typeof alternativeManyPayload
}>

// Categories
export const categoryOnePayload = Prisma.validator<Prisma.CategoryInclude>()({
  tools: {
    where: { tool: { isDraft: false } },
    include: { tool: true },
    orderBy: [{ tool: { isFeatured: "desc" } }, { tool: { score: "desc" } }],
  },
})

export const categoryManyPayload = Prisma.validator<Prisma.CategoryInclude>()({
  _count: { select: { tools: { where: { tool: { isDraft: false } } } } },
})

export type CategoryOne = Prisma.CategoryGetPayload<{ include: typeof categoryOnePayload }>
export type CategoryMany = Prisma.CategoryGetPayload<{ include: typeof categoryManyPayload }>

// Topics
export const topicOnePayload = Prisma.validator<Prisma.TopicInclude>()({
  tools: {
    where: { tool: { isDraft: false } },
    include: { tool: true },
    orderBy: [{ tool: { isFeatured: "desc" } }, { tool: { score: "desc" } }],
  },
})

export const topicManyPayload = Prisma.validator<Prisma.TopicInclude>()({
  _count: { select: { tools: { where: { tool: { isDraft: false } } } } },
})

export type TopicOne = Prisma.TopicGetPayload<{ include: typeof topicOnePayload }>
export type TopicMany = Prisma.TopicGetPayload<{ include: typeof topicManyPayload }>

// Languages
export const languageOnePayload = Prisma.validator<Prisma.LanguageInclude>()({
  tools: {
    where: { tool: { isDraft: false } },
    include: { tool: true },
    orderBy: [{ tool: { isFeatured: "desc" } }, { tool: { score: "desc" } }],
  },
})

export const languageManyPayload = Prisma.validator<Prisma.LanguageInclude>()({
  _count: { select: { tools: { where: { tool: { isDraft: false } } } } },
})

export type LanguageOne = Prisma.LanguageGetPayload<{ include: typeof languageOnePayload }>
export type LanguageMany = Prisma.LanguageGetPayload<{ include: typeof languageManyPayload }>

// Tools
export const toolOnePayload = Prisma.validator<Prisma.ToolInclude>()({
  alternatives: {
    orderBy: { alternative: { name: "asc" } },
    include: { alternative: { include: alternativeManyPayload } },
  },
  categories: {
    orderBy: { category: { name: "asc" } },
    include: { category: { include: categoryManyPayload } },
  },
  topics: {
    orderBy: { topic: { slug: "asc" } },
    include: { topic: { include: topicManyPayload } },
  },
  languages: {
    orderBy: { percentage: "desc" },
    include: { language: { include: languageManyPayload } },
  },
})

export const toolManyPayload = Prisma.validator<Prisma.ToolInclude>()({})

export type ToolOne = Prisma.ToolGetPayload<{ include: typeof toolOnePayload }>
export type ToolMany = Prisma.ToolGetPayload<{ include: typeof toolManyPayload }>
