import { performance } from "node:perf_hooks"
import { type Prisma, ToolStatus } from "@prisma/client"
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache"
import type { FilterSchema } from "~/server/web/shared/schema"
import {
  toolManyExtendedPayload,
  toolManyPayload,
  toolOnePayload,
} from "~/server/web/tools/payloads"
import { db } from "~/services/db"
import { getMeilisearchIndex } from "~/services/meilisearch"

export const searchTools = async (search: FilterSchema, where?: Prisma.ToolWhereInput) => {
  "use cache"

  cacheTag("tools")
  cacheLife("max")

  const { q, page, sort, perPage, alternative, category, stack, license } = search
  const start = performance.now()
  const skip = (page - 1) * perPage
  const take = perPage
  const [sortBy, sortOrder] = sort.split(".")

  const whereQuery: Prisma.ToolWhereInput = {
    status: ToolStatus.Published,
    ...(!!alternative.length && { alternatives: { some: { slug: { in: alternative } } } }),
    ...(!!category.length && { categories: { some: { slug: { in: category } } } }),
    ...(!!stack.length && { stacks: { some: { slug: { in: stack } } } }),
    ...(!!license.length && { license: { slug: { in: license } } }),
  }

  if (q) {
    whereQuery.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { tagline: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ]
  }

  const [tools, totalCount] = await db.$transaction([
    db.tool.findMany({
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

  console.log(`Tools search: ${Math.round(performance.now() - start)}ms`)

  const pageCount = Math.ceil(totalCount / perPage)
  return { tools, totalCount, pageCount }
}

export const findRelatedTools = async (id: string) => {
  "use cache"

  cacheTag(`related-tools-${id}`)
  cacheLife("hours")

  const similarTools = await getMeilisearchIndex("tools").searchSimilarDocuments<{ id: string }>({
    id,
    embedder: "openai",
    limit: 3,
    attributesToRetrieve: ["id"],
    rankingScoreThreshold: 0.7,
  })

  return await db.tool.findMany({
    where: { id: { in: similarTools.hits.map(hit => hit.id) } },
    select: toolManyPayload,
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

export const countSubmittedTools = async ({ where, ...args }: Prisma.ToolCountArgs) => {
  return db.tool.count({
    ...args,
    where: {
      status: { in: [ToolStatus.Scheduled, ToolStatus.Draft] },
      submitterEmail: { not: null },
      ...where,
    },
  })
}

export const findTool = async ({ where, ...args }: Prisma.ToolFindFirstArgs = {}) => {
  "use cache"

  cacheTag("tool", `tool-${where?.slug}`)
  cacheLife("max")

  return db.tool.findFirst({
    ...args,
    where: { ...where },
    select: toolOnePayload,
  })
}
