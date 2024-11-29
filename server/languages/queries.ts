import type { Prisma } from "@prisma/client"
import { cache } from "~/lib/cache"
import { languageManyPayload, languageOnePayload } from "~/server/languages/payloads"
import { prisma } from "~/services/prisma"

export const findLanguages = cache(
  async ({ where, orderBy, ...args }: Prisma.LanguageFindManyArgs) => {
    return prisma.language.findMany({
      ...args,
      orderBy: orderBy ?? [{ tools: { _count: "desc" } }, { name: "asc" }],
      where: { tools: { some: { tool: { publishedAt: { lte: new Date() } } } }, ...where },
      include: languageManyPayload,
    })
  },
)

export const findLanguageSlugs = cache(
  async ({ where, orderBy, ...args }: Prisma.LanguageFindManyArgs) => {
    return prisma.language.findMany({
      ...args,
      orderBy: orderBy ?? { name: "asc" },
      where: { tools: { some: { tool: { publishedAt: { lte: new Date() } } } }, ...where },
      select: { slug: true, updatedAt: true },
    })
  },
)

export const findLanguage = cache(async ({ ...args }: Prisma.LanguageFindUniqueArgs) => {
  return prisma.language.findUnique({
    ...args,
    include: languageOnePayload,
  })
})
