import { performance } from "node:perf_hooks"
import { type Prisma, ToolStatus } from "@prisma/client"
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache"
import { alternativeManyPayload, alternativeOnePayload } from "~/server/web/alternatives/payloads"
import type { FilterSchema } from "~/server/web/shared/schema"
import { db } from "~/services/db"
import { getMeiliIndex } from "~/services/meilisearch"
import { tryCatch } from "~/utils/helpers"

export const searchAlternatives = async (
  search: FilterSchema,
  where?: Prisma.AlternativeWhereInput,
) => {
  "use cache"

  cacheTag("alternatives")
  cacheLife("max")

  const { q, page, sort, perPage } = search
  const start = performance.now()
  const skip = (page - 1) * perPage
  const take = perPage
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
      orderBy:
        sortBy && sortBy !== "default"
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

  console.log(`Alternatives search: ${Math.round(performance.now() - start)}ms`)

  const pageCount = Math.ceil(totalCount / perPage)
  return { alternatives, totalCount, pageCount }
}

export const findRelatedAlternatives = async (id: string) => {
  "use cache"

  cacheTag(`related-alternatives-${id}`)
  cacheLife("hours")

  const limit = 6

  const { data, error } = await tryCatch(
    getMeiliIndex("alternatives").searchSimilarDocuments<{ id: string }>({
      id,
      limit,
      embedder: "openai",
      attributesToRetrieve: ["id"],
      rankingScoreThreshold: 0.6,
    }),
  )

  if (error) {
    console.error(error)
    return []
  }

  return await db.alternative.findMany({
    where: { id: { in: data.hits.map(hit => hit.id) } },
    select: alternativeManyPayload,
  })
}

export const findFeaturedAlternatives = async ({
  where,
  ...args
}: Prisma.AlternativeFindManyArgs) => {
  "use cache"

  cacheTag("featured-alternatives")
  cacheLife("max")

  const list = [
    "monday",
    "notion",
    "airtable",
    "typeform",
    "teamwork",
    "todoist",
    "kissmetrics",
    "fathom-analytics",
  ]

  return await findAlternatives({
    where: { slug: { in: list }, ...where },
    ...args,
  })
}

export const findAlternatives = async ({
  where,
  orderBy,
  ...args
}: Prisma.AlternativeFindManyArgs) => {
  "use cache"

  cacheTag("alternatives")
  cacheLife("max")

  return db.alternative.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { tools: { some: { status: ToolStatus.Published } }, ...where },
    select: alternativeManyPayload,
  })
}

export const findAlternativeSlugs = async ({
  where,
  orderBy,
  ...args
}: Prisma.AlternativeFindManyArgs) => {
  "use cache"

  cacheTag("alternatives")
  cacheLife("max")

  return db.alternative.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { tools: { some: { status: ToolStatus.Published } }, ...where },
    select: { slug: true, updatedAt: true },
  })
}

export const findAlternative = async ({ ...args }: Prisma.AlternativeFindFirstArgs = {}) => {
  "use cache"

  cacheTag("alternative", `alternative-${args.where?.slug}`)
  cacheLife("max")

  return db.alternative.findFirst({
    ...args,
    select: alternativeOnePayload,
  })
}
