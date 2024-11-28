import { getRandomElement } from "@curiousleaf/utils"
import type { Prisma } from "@prisma/client"
import type { SearchParams } from "nuqs/server"
import { toolManyPayload, toolOnePayload } from "~/server/tools/payloads"
import { toolsSearchParamsCache } from "~/server/tools/search-params"
import { prisma } from "~/services/prisma"

export const searchTools = async (
  searchParams: Promise<SearchParams>,
  { where, ...args }: Prisma.ToolFindManyArgs,
) => {
  const { q, category, page, sort, perPage } = toolsSearchParamsCache.parse(await searchParams)

  // Values to paginate the results
  const skip = (page - 1) * perPage
  const take = perPage

  // Column and order to sort by
  // Spliting the sort string by "." to get the column and order
  // Example: "title.desc" => ["title", "desc"]
  const [sortBy, sortOrder] = sort.split(".")

  const whereQuery: Prisma.ToolWhereInput = {
    publishedAt: { lte: new Date() },
    ...(category && { categories: { some: { category: { slug: category } } } }),
    ...(q && {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ],
    }),
  }

  const [tools, totalCount] = await prisma.$transaction([
    prisma.tool.findMany({
      ...args,
      orderBy: sortBy ? { [sortBy]: sortOrder } : [{ isFeatured: "desc" }, { score: "desc" }],
      where: { ...whereQuery, ...where },
      include: toolManyPayload,
      take,
      skip,
    }),

    prisma.tool.count({
      where: { ...whereQuery, ...where },
    }),
  ])

  return { tools, totalCount }
}

export const findRelatedTools = async ({
  where,
  slug,
  take = 3,
  ...args
}: Prisma.ToolFindManyArgs & { slug: string; take?: number }) => {
  const relatedWhereClause = {
    ...where,
    AND: [
      { publishedAt: { lte: new Date() } },
      { slug: { not: slug } },
      { alternatives: { some: { alternative: { tools: { some: { tool: { slug } } } } } } },
    ],
  } satisfies Prisma.ToolWhereInput

  const itemCount = await prisma.tool.count({ where: relatedWhereClause })
  const skip = Math.max(0, Math.floor(Math.random() * itemCount) - take)
  const properties = ["id", "name", "score"] satisfies (keyof Prisma.ToolOrderByWithRelationInput)[]
  const orderBy = getRandomElement(properties)
  const orderDir = getRandomElement(["asc", "desc"] as const)

  return prisma.tool.findMany({
    ...args,
    where: relatedWhereClause,
    include: toolManyPayload,
    orderBy: { [orderBy]: orderDir },
    take,
    skip,
  })
}

export const findTools = async ({ where, orderBy, ...args }: Prisma.ToolFindManyArgs) => {
  return prisma.tool.findMany({
    ...args,
    orderBy: orderBy ?? [{ isFeatured: "desc" }, { score: "desc" }],
    where: { publishedAt: { lte: new Date() }, ...where },
    include: toolManyPayload,
  })
}

export const findToolsWithCategories = async ({ where, ...args }: Prisma.ToolFindManyArgs) => {
  return prisma.tool.findMany({
    ...args,
    where: { publishedAt: { lte: new Date() }, ...where },
    include: { ...toolManyPayload, categories: { include: { category: true } } },
  })
}

export const findToolSlugs = async ({ where, orderBy, ...args }: Prisma.ToolFindManyArgs) => {
  return prisma.tool.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { publishedAt: { lte: new Date() }, ...where },
    select: { slug: true, updatedAt: true },
  })
}

export const countUpcomingTools = async ({ where, ...args }: Prisma.ToolCountArgs) => {
  return prisma.tool.count({
    ...args,
    where: { OR: [{ publishedAt: { gt: new Date() } }, { publishedAt: null }], ...where },
  })
}

export const findTool = async ({ ...args }: Prisma.ToolFindFirstArgs) => {
  return prisma.tool.findFirst({
    ...args,
    include: toolOnePayload,
  })
}
