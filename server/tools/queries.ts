import type { Prisma } from "@prisma/client"
import type { SearchParams } from "nuqs/server"
import { auth } from "~/lib/auth"
import { toolManyPayload, toolOnePayload } from "~/server/tools/payloads"
import { toolsSearchParamsCache } from "~/server/tools/search-params"
import { prisma } from "~/services/prisma"

export const searchTools = async (
  searchParams: SearchParams,
  { where, ...args }: Prisma.ToolFindManyArgs,
) => {
  const { q, category, page, sort, perPage } = toolsSearchParamsCache.parse(searchParams)

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
      orderBy:
        sortBy === "relevance"
          ? [{ isFeatured: "desc" }, { score: "desc" }]
          : { [sortBy]: sortOrder },
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

export const findTools = async ({ where, ...args }: Prisma.ToolFindManyArgs) => {
  return prisma.tool.findMany({
    ...args,
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

export const countTools = async ({ where, ...args }: Prisma.ToolCountArgs) => {
  return prisma.tool.count({
    ...args,
    where: { publishedAt: { lte: new Date() }, ...where },
  })
}

export const countUpcomingTools = async ({ where, ...args }: Prisma.ToolCountArgs) => {
  return prisma.tool.count({
    ...args,
    where: { OR: [{ publishedAt: { gt: new Date() } }, { publishedAt: null }], ...where },
  })
}

export const findUniqueTool = async ({ where, ...args }: Prisma.ToolFindUniqueArgs) => {
  const session = await auth()

  return prisma.tool.findUnique({
    ...args,
    where: { publishedAt: session?.user ? undefined : { lte: new Date() }, ...where },
    include: toolOnePayload,
  })
}

export const findFirstTool = async ({ where, ...args }: Prisma.ToolFindFirstArgs) => {
  return prisma.tool.findFirst({
    ...args,
    where: { publishedAt: { lte: new Date() }, ...where },
  })
}
