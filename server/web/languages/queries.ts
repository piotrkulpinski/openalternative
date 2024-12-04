import { type Prisma, ToolStatus } from "@prisma/client"
import { cache } from "~/lib/cache"
import { languageManyPayload, languageOnePayload } from "~/server/web/languages/payloads"
import { prisma } from "~/services/prisma"

export const findLanguages = cache(
  async ({ where, orderBy, ...args }: Prisma.LanguageFindManyArgs) => {
    return prisma.language.findMany({
      ...args,
      orderBy: orderBy ?? [{ tools: { _count: "desc" } }, { name: "asc" }],
      where: { tools: { some: { tool: { status: ToolStatus.Published } } }, ...where },
      include: languageManyPayload,
    })
  },
  ["languages"],
)

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

export const findLanguageBySlug = (slug: string) =>
  cache(
    async (slug: string) => {
      return prisma.language.findFirst({
        where: { slug },
        include: languageOnePayload,
      })
    },
    ["language", `language-${slug}`],
  )(slug)
