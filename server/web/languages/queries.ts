import { type Prisma, ToolStatus } from "@prisma/client"
import { unstable_cacheTag as cacheTag } from "next/cache"
import { languageManyPayload, languageOnePayload } from "~/server/web/languages/payloads"
import { prisma } from "~/services/prisma"

export const findLanguages = async ({ where, orderBy, ...args }: Prisma.LanguageFindManyArgs) => {
  "use cache"
  cacheTag("languages")

  return prisma.language.findMany({
    ...args,
    orderBy: orderBy ?? [{ tools: { _count: "desc" } }, { name: "asc" }],
    where: { tools: { some: { tool: { status: ToolStatus.Published } } }, ...where },
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
    where: { tools: { some: { tool: { status: ToolStatus.Published } } }, ...where },
    select: { slug: true, updatedAt: true },
  })
}

export const findLanguageBySlug = async (
  slug: string,
  { where, ...args }: Prisma.LanguageFindFirstArgs,
) => {
  "use cache"
  cacheTag("language", `language-${slug}`)

  return prisma.language.findFirst({
    ...args,
    where: { slug, ...where },
    include: languageOnePayload,
  })
}
