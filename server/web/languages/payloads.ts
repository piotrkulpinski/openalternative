import { Prisma, ToolStatus } from "@prisma/client"

export const languageOnePayload = Prisma.validator<Prisma.LanguageSelect>()({
  name: true,
  slug: true,
  color: true,
  _count: { select: { tools: { where: { tool: { status: ToolStatus.Published } } } } },
})

export const languageManyPayload = Prisma.validator<Prisma.LanguageSelect>()({
  name: true,
  slug: true,
  color: true,
  _count: { select: { tools: { where: { tool: { status: ToolStatus.Published } } } } },
})

export type LanguageOne = Prisma.LanguageGetPayload<{ select: typeof languageOnePayload }>
export type LanguageMany = Prisma.LanguageGetPayload<{ select: typeof languageManyPayload }>
