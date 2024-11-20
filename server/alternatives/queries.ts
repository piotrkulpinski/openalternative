import type { Prisma } from "@prisma/client"
import type { SearchParams } from "nuqs/server"
import { alternativeManyPayload, alternativeOnePayload } from "~/server/alternatives/payloads"
import { alternativesSearchParamsCache } from "~/server/alternatives/search-params"
import { prisma } from "~/services/prisma"

export const searchAlternatives = async (
  searchParams: SearchParams,
  { where, ...args }: Prisma.AlternativeFindManyArgs,
) => {
  const { q, page, sort, perPage } = alternativesSearchParamsCache.parse(searchParams)

  // Values to paginate the results
  const skip = (page - 1) * perPage
  const take = perPage

  // Column and order to sort by
  // Spliting the sort string by "." to get the column and order
  // Example: "title.desc" => ["title", "desc"]
  const [sortBy, sortOrder] = sort.split(".")

  const whereQuery: Prisma.AlternativeWhereInput = {
    tools: { some: { tool: { publishedAt: { lte: new Date() } } } },
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
      orderBy: [{ isFeatured: "desc" }, { [sortBy]: sortOrder }],
      where: { ...whereQuery, ...where },
      include: alternativeManyPayload,
      take,
      skip,
    }),

    prisma.alternative.count({
      where: { ...whereQuery, ...where },
    }),
  ])

  return { alternatives, totalCount }
}

export const findAlternatives = async ({
  where,
  orderBy,
  ...args
}: Prisma.AlternativeFindManyArgs) => {
  return prisma.alternative.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { tools: { some: { tool: { publishedAt: { lte: new Date() } } } }, ...where },
    include: alternativeManyPayload,
  })
}

export const findAlternativeSlugs = async ({
  where,
  orderBy,
  ...args
}: Prisma.AlternativeFindManyArgs) => {
  return prisma.alternative.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { tools: { some: { tool: { publishedAt: { lte: new Date() } } } }, ...where },
    select: { slug: true, updatedAt: true },
  })
}

export const findUniqueAlternative = async ({ ...args }: Prisma.AlternativeFindUniqueArgs) => {
  return prisma.alternative.findUnique({
    ...args,
    include: alternativeOnePayload,
  })
}
