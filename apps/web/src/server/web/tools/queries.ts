import { performance } from "node:perf_hooks"
import { getRandomElement } from "@curiousleaf/utils"
import { db } from "@openalternative/db"
import { type Prisma, type Tool, ToolStatus } from "@openalternative/db/client"
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache"
import type { inferParserType } from "nuqs/server"
import {
  toolManyExtendedPayload,
  toolManyPayload,
  toolOnePayload,
} from "~/server/web/tools/payloads"
import type { toolsSearchParams } from "~/server/web/tools/search-params"

export const searchTools = async (
  search: inferParserType<typeof toolsSearchParams>,
  { where, ...args }: Prisma.ToolFindManyArgs,
) => {
  "use cache"

  cacheTag("tools")
  cacheLife("max")

  const { q, alternative, category, stack, license, page, sort, perPage } = search
  const start = performance.now()
  const skip = (page - 1) * perPage
  const take = perPage
  const [sortBy, sortOrder] = sort.split(".")

  const whereQuery: Prisma.ToolWhereInput = {
    status: ToolStatus.Published,
    ...(alternative.length && { alternatives: { some: { slug: { in: alternative } } } }),
    ...(category.length && { categories: { some: { slug: { in: category } } } }),
    ...(stack.length && { stacks: { some: { slug: { in: stack } } } }),
    ...(license.length && { license: { slug: { in: license } } }),
  }

  // Use full-text search when query exists
  if (q) {
    const searchQuery: { id: string }[] = await db.$queryRaw`
        SELECT id
        FROM "Tool", plainto_tsquery('english', ${q}) query
        WHERE "searchVector" @@ query
      `

    whereQuery.id = { in: searchQuery.map(r => r.id) }
  }

  const [tools, totalCount] = await db.$transaction([
    db.tool.findMany({
      ...args,
      orderBy: sortBy ? { [sortBy]: sortOrder } : [{ isFeatured: "desc" }, { score: "desc" }],
      where: { ...whereQuery, ...where },
      select: toolManyPayload,
      take,
      skip,
    }),

    db.tool.count({
      where: { ...whereQuery, ...where },
    }),
  ])

  console.log("Tools search:", performance.now() - start)

  return { tools, totalCount }
}

export const findRelatedTools = async ({
  where,
  slug,
  ...args
}: Prisma.ToolFindManyArgs & { slug: string }) => {
  "use cache"

  cacheTag("related-tools")
  cacheLife("minutes")

  const relatedWhereClause = {
    ...where,
    AND: [
      { status: ToolStatus.Published },
      { slug: { not: slug } },
      { alternatives: { some: { tools: { some: { slug } } } } },
    ],
  } satisfies Prisma.ToolWhereInput

  const take = 3
  const itemCount = await db.tool.count({ where: relatedWhereClause })
  const skip = Math.max(0, Math.floor(Math.random() * itemCount) - take)
  const properties = ["id", "name", "score"] satisfies (keyof Prisma.ToolOrderByWithRelationInput)[]
  const orderBy = getRandomElement(properties)
  const orderDir = getRandomElement(["asc", "desc"] as const)

  return db.tool.findMany({
    ...args,
    where: relatedWhereClause,
    select: toolManyPayload,
    orderBy: { [orderBy]: orderDir },
    take,
    skip,
  })
}

export const findTools = async ({ where, orderBy, ...args }: Prisma.ToolFindManyArgs) => {
  "use cache"

  cacheTag("tools")
  cacheLife("max")

  return db.tool.findMany({
    ...args,
    where: { status: ToolStatus.Published, ...where },
    orderBy: orderBy ?? [{ isFeatured: "desc" }, { score: "desc" }],
    select: toolManyPayload,
  })
}

export const findToolsWithCategories = async ({ where, ...args }: Prisma.ToolFindManyArgs) => {
  "use cache"

  cacheTag("tools")
  cacheLife("max")

  return db.tool.findMany({
    ...args,
    where: { status: ToolStatus.Published, ...where },
    select: toolManyExtendedPayload,
  })
}

export const findToolSlugs = async ({ where, orderBy, ...args }: Prisma.ToolFindManyArgs) => {
  "use cache"

  cacheTag("tools")
  cacheLife("max")

  return db.tool.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { status: ToolStatus.Published, ...where },
    select: { slug: true, updatedAt: true },
  })
}

export const countUpcomingTools = async ({ where, ...args }: Prisma.ToolCountArgs) => {
  return db.tool.count({
    ...args,
    where: { status: { in: [ToolStatus.Scheduled, ToolStatus.Draft] }, ...where },
  })
}

export const findTool = async ({ where, ...args }: Prisma.ToolFindFirstArgs = {}) => {
  "use cache"

  cacheTag("tool", `tool-${where?.slug}`)
  cacheLife("max")

  return db.tool.findFirst({
    ...args,
    where: { status: { not: ToolStatus.Draft }, ...where },
    select: toolOnePayload,
  })
}

export const findRandomTool = async () => {
  const tools = await db.$queryRaw<Array<Tool>>`
    SELECT "id", "name", "slug", "websiteUrl", "repositoryUrl", "tagline", "description", "content", "stars", "forks", "score",
           "faviconUrl", "screenshotUrl", "firstCommitDate", "lastCommitDate", "status", "publishedAt", "createdAt", "updatedAt"
    FROM "Tool"
    WHERE status = 'Published'
    GROUP BY id
    ORDER BY RANDOM()
    LIMIT 1
  `

  return tools[0]
}
