import { getRandomElement } from "@curiousleaf/utils"
import { type Prisma, ToolStatus } from "@prisma/client"
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache"
import type { inferParserType } from "nuqs/server"
import { toolManyPayload, toolOnePayload } from "~/server/web/tools/payloads"
import type { toolsSearchParams } from "~/server/web/tools/search-params"
import { prisma } from "~/services/prisma"

export const searchTools = async (
  { q, category, page, sort, perPage }: inferParserType<typeof toolsSearchParams>,
  { where, ...args }: Prisma.ToolFindManyArgs,
) => {
  "use cache"
  cacheTag("tools")

  // Values to paginate the results
  const skip = (page - 1) * perPage
  const take = perPage

  // Column and order to sort by
  // Spliting the sort string by "." to get the column and order
  // Example: "title.desc" => ["title", "desc"]
  const [sortBy, sortOrder] = sort.split(".")

  const whereQuery: Prisma.ToolWhereInput = {
    status: ToolStatus.Published,
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
  ...args
}: Prisma.ToolFindManyArgs & { slug: string }) => {
  const relatedWhereClause = {
    ...where,
    AND: [
      { status: ToolStatus.Published },
      { slug: { not: slug } },
      { alternatives: { some: { alternative: { tools: { some: { tool: { slug } } } } } } },
    ],
  } satisfies Prisma.ToolWhereInput

  const take = 3
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
  "use cache"
  cacheTag("tools")

  return prisma.tool.findMany({
    ...args,
    orderBy: orderBy ?? [{ isFeatured: "desc" }, { score: "desc" }],
    where: { status: ToolStatus.Published, ...where },
    include: toolManyPayload,
  })
}

export const findToolsWithCategories = async ({ where, ...args }: Prisma.ToolFindManyArgs) => {
  "use cache"
  cacheTag("tools")

  return prisma.tool.findMany({
    ...args,
    where: { status: ToolStatus.Published, ...where },
    include: { ...toolManyPayload, categories: { include: { category: true } } },
  })
}

export const findToolSlugs = async ({ where, orderBy, ...args }: Prisma.ToolFindManyArgs) => {
  return prisma.tool.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { status: ToolStatus.Published, ...where },
    select: { slug: true, updatedAt: true },
  })
}

export const countUpcomingTools = async ({ where, ...args }: Prisma.ToolCountArgs) => {
  "use cache"
  cacheTag("schedule")
  cacheLife("hours")

  return prisma.tool.count({
    ...args,
    where: { status: { in: [ToolStatus.Scheduled, ToolStatus.Draft] }, ...where },
  })
}

export const findToolBySlug = async (
  slug: string,
  { where, ...args }: Prisma.ToolFindFirstArgs,
) => {
  "use cache"
  cacheTag("tool", `tool-${slug}`)

  return prisma.tool.findFirst({
    ...args,
    where: { slug, ...where },
    include: toolOnePayload,
  })
}
