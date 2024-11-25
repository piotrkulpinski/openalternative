import type { Prisma } from "@prisma/client"
import { languageManyPayload, languageOnePayload } from "~/server/languages/payloads"
import { prisma } from "~/services/prisma"

export const findLanguages = async ({ where, orderBy, ...args }: Prisma.LanguageFindManyArgs) => {
  return prisma.language.findMany({
    ...args,
    orderBy: orderBy ?? { tools: { _count: "desc" } },
    where: { tools: { some: { tool: { publishedAt: { lte: new Date() } } } }, ...where },
    include: languageManyPayload,
  })
}

export const findLanguageSlugs = async ({
  where,
  orderBy,
  ...args
}: Prisma.LanguageFindManyArgs) => {
  return prisma.language.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { tools: { some: { tool: { publishedAt: { lte: new Date() } } } }, ...where },
    select: { slug: true, updatedAt: true },
  })
}

export const findLanguage = async ({ ...args }: Prisma.LanguageFindUniqueArgs) => {
  return prisma.language.findUnique({
    ...args,
    include: languageOnePayload,
  })
}
