import { performance } from "node:perf_hooks"
import { db } from "@openalternative/db"
import { type Prisma, ToolStatus } from "@openalternative/db/client"
import type { inferParserType } from "nuqs/server"
import { cache } from "~/lib/cache"
import { alternativeManyPayload, alternativeOnePayload } from "~/server/web/alternatives/payloads"
import type { alternativesSearchParams } from "~/server/web/alternatives/search-params"

export const searchAlternatives = cache(
  async (
    { q, page, sort, perPage }: inferParserType<typeof alternativesSearchParams>,
    { where, ...args }: Prisma.AlternativeFindManyArgs,
  ) => {
    const start = performance.now()
    // Values to paginate the results
    const skip = (page - 1) * perPage
    const take = perPage

    // Column and order to sort by
    // Spliting the sort string by "." to get the column and order
    // Example: "title.desc" => ["title", "desc"]
    const [sortBy, sortOrder] = sort.split(".")

    const whereQuery: Prisma.AlternativeWhereInput = {
      tools: { some: { status: ToolStatus.Published } },
      ...(q && {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      }),
    }

    const [alternatives, totalCount] = await db.$transaction([
      db.alternative.findMany({
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

      db.alternative.count({
        where: { ...whereQuery, ...where },
      }),
    ])

    console.log("searchTools", performance.now() - start)

    return { alternatives, totalCount }
  },
  ["alternatives"],
)

export const findAlternatives = cache(
  async ({ where, orderBy, ...args }: Prisma.AlternativeFindManyArgs) => {
    return db.alternative.findMany({
      ...args,
      orderBy: orderBy ?? { name: "asc" },
      where: { tools: { some: { status: ToolStatus.Published } }, ...where },
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
  return db.alternative.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { tools: { some: { status: ToolStatus.Published } }, ...where },
    select: { slug: true, updatedAt: true },
  })
}

export const findAlternativeBySlug = (
  slug: string,
  { where, ...args }: Prisma.AlternativeFindFirstArgs = {},
) =>
  cache(
    async (slug: string) => {
      return db.alternative.findFirst({
        ...args,
        where: { slug, ...where },
        select: alternativeOnePayload,
      })
    },
    ["alternative", `alternative-${slug}`],
  )(slug)
