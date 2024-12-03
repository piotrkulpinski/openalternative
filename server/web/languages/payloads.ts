import { Prisma, ToolStatus } from "@prisma/client"

export const languageOnePayload = Prisma.validator<Prisma.LanguageInclude>()({
  _count: { select: { tools: { where: { tool: { status: ToolStatus.Published } } } } },
})

export const languageManyPayload = Prisma.validator<Prisma.LanguageInclude>()({
  _count: { select: { tools: { where: { tool: { status: ToolStatus.Published } } } } },
})

export type LanguageOne = Prisma.LanguageGetPayload<{ include: typeof languageOnePayload }>
export type LanguageMany = Prisma.LanguageGetPayload<{ include: typeof languageManyPayload }>
