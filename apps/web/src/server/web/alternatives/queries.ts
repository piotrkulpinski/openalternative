import { performance } from "node:perf_hooks"
import { db } from "@openalternative/db"
import { type Prisma, ToolStatus } from "@openalternative/db/client"
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache"
import type { inferParserType } from "nuqs/server"
import { alternativeManyPayload, alternativeOnePayload } from "~/server/web/alternatives/payloads"
import type { alternativesSearchParams } from "~/server/web/alternatives/search-params"

export const searchAlternatives = async (
  { q, page, sort, perPage }: inferParserType<typeof alternativesSearchParams>,
  { where, ...args }: Prisma.AlternativeFindManyArgs,
) => {
  "use cache"

  cacheTag("alternatives")
  cacheLife("max")

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

  console.log("Alternatives search:", performance.now() - start)

  return { alternatives, totalCount }
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
