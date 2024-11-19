import { Prisma } from "@prisma/client"

export const languageOnePayload = Prisma.validator<Prisma.LanguageInclude>()({})
export const languageManyPayload = Prisma.validator<Prisma.LanguageInclude>()({
  _count: { select: { tools: { where: { tool: { publishedAt: { lte: new Date() } } } } } },
})

export type LanguageOne = Prisma.LanguageGetPayload<{ include: typeof languageOnePayload }>
export type LanguageMany = Prisma.LanguageGetPayload<{ include: typeof languageManyPayload }>
