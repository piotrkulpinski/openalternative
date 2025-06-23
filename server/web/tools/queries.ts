import { performance } from "node:perf_hooks"
import { type Prisma, ToolStatus } from "@prisma/client"
import type { SearchSimilarDocumentsParams } from "meilisearch"
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache"
import type { FilterSchema } from "~/server/web/shared/schema"
import {
  toolManyExtendedPayload,
  toolManyPayload,
  toolOnePayload,
} from "~/server/web/tools/payloads"
import { db } from "~/services/db"
import { getMeiliIndex } from "~/services/meilisearch"
import { tryCatch } from "~/utils/helpers"

export const searchTools = async (search: FilterSchema, where?: Prisma.ToolWhereInput) => {
  "use cache"

  cacheTag("tools")
  cacheLife("max")

  const { q, page, sort, perPage, alternative, category, stack, license } = search
  const start = performance.now()
  const skip = (page - 1) * perPage
  const take = perPage

  let orderBy: Prisma.ToolFindManyArgs["orderBy"] = [{ isFeatured: "desc" }, { score: "desc" }]

  if (sort !== "default") {
    const [sortBy, sortOrder] = sort.split(".") as [keyof typeof orderBy, Prisma.SortOrder]
    orderBy = { [sortBy]: sortOrder }
  }

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
      where: { ...whereQuery, ...where },
      select: toolManyPayload,
      orderBy,
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

export const findRelatedToolIds = async ({ id, ...params }: SearchSimilarDocumentsParams) => {
  "use cache"

  cacheTag(`related-tool-ids-${id}`)
  cacheLife("hours")

  const { data, error } = await tryCatch(
    getMeiliIndex("tools").searchSimilarDocuments<{ id: string }>({
      id,
      limit: 3,
      embedder: "openAi",
      attributesToRetrieve: ["id"],
      rankingScoreThreshold: 0.7,
      filter: ["status = 'Published'"],
      ...params,
    }),
  )

  if (error) {
    console.error(error)
    return []
  }

  return data.hits.map(hit => hit.id)
}

export const findRelatedTools = async ({ id, ...params }: SearchSimilarDocumentsParams) => {
  "use cache"

  cacheTag(`related-tools-${id}`)
  cacheLife("hours")

  // Find related tool ids in MeiliSearch
  const ids = await findRelatedToolIds({ id, ...params })

  return await db.tool.findMany({
    where: { id: { in: ids } },
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
