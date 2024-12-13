import { prisma } from "@openalternative/db"
import { type Prisma, ToolStatus } from "@openalternative/db/client"
import { cache } from "~/lib/cache"
import { languageManyPayload, languageOnePayload } from "~/server/web/languages/payloads"

export const findLanguages = cache(
  async ({ where, orderBy, ...args }: Prisma.LanguageFindManyArgs) => {
    return prisma.language.findMany({
      ...args,
      orderBy: orderBy ?? [{ tools: { _count: "desc" } }, { name: "asc" }],
      where: { tools: { some: { tool: { status: ToolStatus.Published } } }, ...where },
      select: languageManyPayload,
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

export const findLanguageBySlug = (
  slug: string,
  { where, ...args }: Prisma.LanguageFindFirstArgs = {},
) =>
  cache(
    async (slug: string) => {
      return prisma.language.findFirst({
        ...args,
        where: { slug, ...where },
        select: languageOnePayload,
      })
    },
    ["language", `language-${slug}`],
  )(slug)
