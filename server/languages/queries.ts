import type { Prisma } from "@prisma/client"
import { languageManyPayload, languageOnePayload } from "~/server/languages/payloads"
import { prisma } from "~/services/prisma"

export const findLanguages = async ({ where, orderBy, ...args }: Prisma.LanguageFindManyArgs) => {
  "use cache"

  return prisma.language.findMany({
    ...args,
    orderBy: orderBy ?? [{ tools: { _count: "desc" } }, { name: "asc" }],
    where: { tools: { some: { tool: { status: "Published" } } }, ...where },
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
    where: { tools: { some: { tool: { status: "Published" } } }, ...where },
    select: { slug: true, updatedAt: true },
  })
}

export const findLanguage = async ({ ...args }: Prisma.LanguageFindUniqueArgs) => {
  "use cache"

  return prisma.language.findUnique({
    ...args,
    include: languageOnePayload,
  })
}
