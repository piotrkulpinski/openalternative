import { Prisma } from "@prisma/client"

// Alternatives
export const alternativeOnePayload = Prisma.validator<Prisma.AlternativeInclude>()({
  tools: true,
})

export const alternativeManyPayload = Prisma.validator<Prisma.AlternativeInclude>()({
  _count: { select: { tools: true } },
})

export type AlternativeOne = Prisma.AlternativeGetPayload<{ include: typeof alternativeOnePayload }>
export type AlternativeMany = Prisma.AlternativeGetPayload<{
  include: typeof alternativeManyPayload
}>

// Categories
export const categoryOnePayload = Prisma.validator<Prisma.CategoryInclude>()({
  tools: true,
})

export const categoryManyPayload = Prisma.validator<Prisma.CategoryInclude>()({
  _count: { select: { tools: true } },
})

export type CategoryOne = Prisma.CategoryGetPayload<{ include: typeof categoryOnePayload }>
export type CategoryMany = Prisma.CategoryGetPayload<{ include: typeof categoryManyPayload }>

// Languages
export const languageOnePayload = Prisma.validator<Prisma.LanguageInclude>()({
  tools: true,
})

export const languageManyPayload = Prisma.validator<Prisma.LanguageInclude>()({
  _count: { select: { tools: true } },
})

export type LanguageOne = Prisma.LanguageGetPayload<{ include: typeof languageOnePayload }>
export type LanguageMany = Prisma.LanguageGetPayload<{ include: typeof languageManyPayload }>

// Topics
export const topicOnePayload = Prisma.validator<Prisma.TopicInclude>()({
  tools: true,
})

export const topicManyPayload = Prisma.validator<Prisma.TopicInclude>()({
  _count: { select: { tools: true } },
})

export type TopicOne = Prisma.TopicGetPayload<{ include: typeof topicOnePayload }>
export type TopicMany = Prisma.TopicGetPayload<{ include: typeof topicManyPayload }>

// Tools
export const toolOnePayload = Prisma.validator<Prisma.ToolInclude>()({
  alternatives: { orderBy: { name: "asc" }, include: alternativeManyPayload },
  categories: { orderBy: { name: "asc" }, include: categoryManyPayload },
  languages: { orderBy: { name: "asc" }, include: languageManyPayload },
  topics: { orderBy: { name: "asc" }, include: topicManyPayload },
})

export const toolManyPayload = Prisma.validator<Prisma.ToolInclude>()({})

export type ToolOne = Prisma.ToolGetPayload<{ include: typeof toolOnePayload }>
export type ToolMany = Prisma.ToolGetPayload<{ include: typeof toolManyPayload }>
