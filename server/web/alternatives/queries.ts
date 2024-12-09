import { type Prisma, ToolStatus } from "@prisma/client"
import type { inferParserType } from "nuqs/server"
import { cache } from "~/lib/cache"
import { alternativeManyPayload, alternativeOnePayload } from "~/server/web/alternatives/payloads"
import type { alternativesSearchParams } from "~/server/web/alternatives/search-params"
import { prisma } from "~/services/prisma"

export const searchAlternatives = cache(
  async (
    { q, page, sort, perPage }: inferParserType<typeof alternativesSearchParams>,
    { where, ...args }: Prisma.AlternativeFindManyArgs,
  ) => {
    // Values to paginate the results
    const skip = (page - 1) * perPage
    const take = perPage

    // Column and order to sort by
    // Spliting the sort string by "." to get the column and order
    // Example: "title.desc" => ["title", "desc"]
    const [sortBy, sortOrder] = sort.split(".")

    const whereQuery: Prisma.AlternativeWhereInput = {
      tools: { some: { tool: { status: ToolStatus.Published } } },
      ...(q && {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      }),
    }

    const [alternatives, totalCount] = await prisma.$transaction([
      prisma.alternative.findMany({
        ...args,
        orderBy:
          sortBy && sortBy !== "popularity"
            ? { [sortBy]: sortOrder }
            : [{ tools: { _count: "desc" } }, { isFeatured: "desc" }],
        where: { ...whereQuery, ...where },
        select: alternativeManyPayload,
        take,
        skip,
      }),

      prisma.alternative.count({
        where: { ...whereQuery, ...where },
      }),
    ])

    return { alternatives, totalCount }
  },
  ["alternatives"],
)

export const findAlternatives = cache(
  async ({ where, orderBy, ...args }: Prisma.AlternativeFindManyArgs) => {
    return prisma.alternative.findMany({
      ...args,
      orderBy: orderBy ?? { name: "asc" },
      where: { tools: { some: { tool: { status: ToolStatus.Published } } }, ...where },
      select: alternativeManyPayload,
    })
  },
  ["alternatives"],
)

export const findAlternativeSlugs = async ({
  where,
  orderBy,
  ...args
}: Prisma.AlternativeFindManyArgs) => {
  return prisma.alternative.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { tools: { some: { tool: { status: ToolStatus.Published } } }, ...where },
    select: { slug: true, updatedAt: true },
  })
}

export const findAlternativeBySlug = (
  slug: string,
  { where, ...args }: Prisma.AlternativeFindFirstArgs = {},
) =>
  cache(
    async (slug: string) => {
      return prisma.alternative.findFirst({
        ...args,
        where: { slug, ...where },
        select: alternativeOnePayload,
      })
    },
    ["alternative", `alternative-${slug}`],
  )(slug)
