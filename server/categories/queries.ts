import type { Prisma } from "@prisma/client"
import { cache } from "~/lib/cache"
import { categoryManyPayload, categoryOnePayload } from "~/server/categories/payloads"
import { prisma } from "~/services/prisma"

export const findCategories = cache(
  async ({ where, orderBy, ...args }: Prisma.CategoryFindManyArgs) => {
    return prisma.category.findMany({
      ...args,
      orderBy: orderBy ?? { name: "asc" },
      where: { tools: { some: { tool: { publishedAt: { lte: new Date() } } } }, ...where },
      include: categoryManyPayload,
    })
  },
)

export const findCategorySlugs = cache(
  async ({ where, orderBy, ...args }: Prisma.CategoryFindManyArgs) => {
    return prisma.category.findMany({
      ...args,
      orderBy: orderBy ?? { name: "asc" },
      where: { tools: { some: { tool: { publishedAt: { lte: new Date() } } } }, ...where },
      select: { slug: true, updatedAt: true },
    })
  },
)

export const findCategory = cache(async ({ ...args }: Prisma.CategoryFindUniqueArgs) => {
  return prisma.category.findUnique({
    ...args,
    include: categoryOnePayload,
  })
})
