import type { Prisma } from "@prisma/client"
import { categoryManyPayload, categoryOnePayload } from "~/server/categories/payloads"
import { prisma } from "~/services/prisma"

export const findCategories = async ({ where, orderBy, ...args }: Prisma.CategoryFindManyArgs) => {
  return prisma.category.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { tools: { some: { tool: { publishedAt: { lte: new Date() } } } }, ...where },
    include: categoryManyPayload,
  })
}

export const findCategorySlugs = async ({
  where,
  orderBy,
  ...args
}: Prisma.CategoryFindManyArgs) => {
  return prisma.category.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { tools: { some: { tool: { publishedAt: { lte: new Date() } } } }, ...where },
    select: { slug: true, updatedAt: true },
  })
}

export const findCategory = async ({ ...args }: Prisma.CategoryFindUniqueArgs) => {
  return prisma.category.findUnique({
    ...args,
    include: categoryOnePayload,
  })
}
