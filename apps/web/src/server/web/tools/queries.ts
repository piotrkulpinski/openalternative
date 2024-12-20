import { getRandomElement } from "@curiousleaf/utils"
import { prisma } from "@openalternative/db"
import { type Prisma, type Tool, ToolStatus } from "@openalternative/db/client"
import type { inferParserType } from "nuqs/server"
import { cache } from "~/lib/cache"
import {
  toolManyExtendedPayload,
  toolManyPayload,
  toolOnePayload,
} from "~/server/web/tools/payloads"
import type { toolsSearchParams } from "~/server/web/tools/search-params"

export const searchTools = cache(
  async (
    { q, category, page, sort, perPage }: inferParserType<typeof toolsSearchParams>,
    { where, ...args }: Prisma.ToolFindManyArgs,
  ) => {
    // Values to paginate the results
    const skip = (page - 1) * perPage
    const take = perPage

    // Column and order to sort by
    // Spliting the sort string by "." to get the column and order
    // Example: "title.desc" => ["title", "desc"]
    const [sortBy, sortOrder] = sort.split(".")

    const whereQuery: Prisma.ToolWhereInput = {
      status: ToolStatus.Published,
      ...(category && { categories: { some: { slug: category } } }),
      ...(q && {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { alternatives: { some: { name: { contains: q, mode: "insensitive" } } } },
          { categories: { some: { name: { contains: q, mode: "insensitive" } } } },
        ],
      }),
    }

    const [tools, totalCount] = await prisma.$transaction([
      prisma.tool.findMany({
        ...args,
        orderBy: sortBy ? { [sortBy]: sortOrder } : [{ isFeatured: "desc" }, { score: "desc" }],
        where: { ...whereQuery, ...where },
        select: toolManyPayload,
        take,
        skip,
      }),

      prisma.tool.count({
        where: { ...whereQuery, ...where },
      }),
    ])

    return { tools, totalCount }
  },
  ["tools"],
)

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
      { alternatives: { some: { tools: { some: { slug } } } } },
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
    select: toolManyPayload,
    orderBy: { [orderBy]: orderDir },
    take,
    skip,
  })
}

export const findTools = cache(
  async ({ where, orderBy, ...args }: Prisma.ToolFindManyArgs) => {
    return prisma.tool.findMany({
      ...args,
      where: { status: ToolStatus.Published, ...where },
      orderBy: orderBy ?? [{ isFeatured: "desc" }, { score: "desc" }],
      select: toolManyPayload,
    })
  },
  ["tools"],
)

export const findToolsWithCategories = cache(
  async ({ where, ...args }: Prisma.ToolFindManyArgs) => {
    return prisma.tool.findMany({
      ...args,
      where: { status: ToolStatus.Published, ...where },
      select: toolManyExtendedPayload,
    })
  },
  ["tools"],
)

export const findToolSlugs = async ({ where, orderBy, ...args }: Prisma.ToolFindManyArgs) => {
  return prisma.tool.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { status: ToolStatus.Published, ...where },
    select: { slug: true, updatedAt: true },
  })
}

export const countUpcomingTools = cache(
  async ({ where, ...args }: Prisma.ToolCountArgs) => {
    return prisma.tool.count({
      ...args,
      where: { status: { in: [ToolStatus.Scheduled, ToolStatus.Draft] }, ...where },
    })
  },
  ["schedule"],
)

export const findToolBySlug = (slug: string, { where, ...args }: Prisma.ToolFindFirstArgs = {}) =>
  cache(
    async (slug: string) => {
      return prisma.tool.findFirst({
        ...args,
        where: { slug, status: { not: ToolStatus.Draft }, ...where },
        select: toolOnePayload,
      })
    },
    ["tool", `tool-${slug}`],
  )(slug)

export const findRandomTool = async () => {
  const tools = await prisma.$queryRaw<Array<Tool>>`
    SELECT *
    FROM "Tool"
    WHERE status = 'Published'
    GROUP BY id
    ORDER BY RANDOM()
    LIMIT 1
  `

  return tools[0]
}
