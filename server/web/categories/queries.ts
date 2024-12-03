import type { Prisma } from "@prisma/client"
import { unstable_cacheTag as cacheTag } from "next/cache"
import { categoryManyPayload, categoryOnePayload } from "~/server/web/categories/payloads"
import { prisma } from "~/services/prisma"

export const findCategories = async ({ where, orderBy, ...args }: Prisma.CategoryFindManyArgs) => {
  "use cache"
  cacheTag("categories")

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
  return prisma.category.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { tools: { some: { tool: { status: "Published" } } }, ...where },
    select: { slug: true, updatedAt: true },
  })
}

export const findCategoryBySlug = async (
  slug: string,
  { where, ...args }: Prisma.CategoryFindFirstArgs,
) => {
  "use cache"
  cacheTag(`category-${slug}`)

  return prisma.category.findFirst({
    ...args,
    where: { slug, ...where },
    include: categoryOnePayload,
  })
}
