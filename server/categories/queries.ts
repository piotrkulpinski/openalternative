import type { Prisma } from "@prisma/client"
import { categoryManyPayload, categoryOnePayload } from "~/server/categories/payloads"
import { prisma } from "~/services/prisma"

export const findCategories = async ({ where, orderBy, ...args }: Prisma.CategoryFindManyArgs) => {
  "use cache"

  return prisma.category.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { tools: { some: { tool: { status: "Published" } } }, ...where },
    include: categoryManyPayload,
  })
}

export const findCategorySlugs = async ({
  where,
  orderBy,
  ...args
}: Prisma.CategoryFindManyArgs) => {
  "use cache"

  return prisma.category.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { tools: { some: { tool: { status: "Published" } } }, ...where },
    select: { slug: true, updatedAt: true },
  })
}

export const findCategory = async ({ ...args }: Prisma.CategoryFindUniqueArgs) => {
  "use cache"

  return prisma.category.findUnique({
    ...args,
    include: categoryOnePayload,
  })
}
