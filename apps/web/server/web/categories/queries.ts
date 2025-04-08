import { db } from "@openalternative/db"
import { type Prisma, ToolStatus } from "@openalternative/db/client"
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache"
import {
  categoryManyNestedPayload,
  categoryManyPayload,
  categoryOnePayload,
} from "~/server/web/categories/payloads"

export const findCategories = async ({ where, orderBy, ...args }: Prisma.CategoryFindManyArgs) => {
  "use cache"

  cacheTag("categories")
  cacheLife("max")

  return db.category.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { tools: { some: { status: ToolStatus.Published } }, ...where },
    select: categoryManyPayload,
  })
}

export const findRootCategories = async ({
  where,
  orderBy,
  ...args
}: Prisma.CategoryFindManyArgs = {}) => {
  "use cache"

  cacheTag("categories")
  cacheLife("max")

  return db.category.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    where: { parentId: null, ...where },
    select: categoryManyNestedPayload,
  })
}

export const findCategorySlugs = async ({
  // where,
  orderBy,
  ...args
}: Prisma.CategoryFindManyArgs) => {
  "use cache"

  cacheTag("categories")
  cacheLife("max")

  return db.category.findMany({
    ...args,
    orderBy: orderBy ?? { name: "asc" },
    // where: { tools: { some: { status: ToolStatus.Published } }, ...where },
    select: { slug: true, fullPath: true, updatedAt: true },
  })
}

export const findCategoryBySlug = async (slug: string) => {
  "use cache"

  cacheTag("category", `category-${slug}`)
  cacheLife("max")

  return db.category.findFirst({
    where: { slug },
    select: categoryOnePayload,
  })
}

export const findCategoryByPath = async (fullPath: string) => {
  "use cache"

  cacheTag("category", `category-${fullPath.split("/").pop()}`)
  cacheLife("max")

  return db.category.findFirst({
    where: { fullPath },
    select: categoryOnePayload,
  })
}

export const findCategoryTree = async (fullPath: string) => {
  "use cache"

  cacheTag("categories", `category-tree-${fullPath}`)
  cacheLife("max")

  const categories = await db.category.findMany({
    where: { slug: { in: fullPath.split("/") } },
    select: { name: true, slug: true, label: true, fullPath: true },
  })

  return categories.sort((a, b) => a.fullPath.length - b.fullPath.length)
}

export const getCategoryTreeSlugs = async (parentSlug: string): Promise<string[]> => {
  const result = await db.$queryRaw<{ slug: string }[]>`
    WITH RECURSIVE category_tree AS (
      -- Base case: start with the parent category
      SELECT id, slug, "parentId"
      FROM "Category"
      WHERE slug = ${parentSlug}
      
      UNION ALL
      
      -- Recursive case: get all children
      SELECT c.id, c.slug, c."parentId"
      FROM "Category" c
      INNER JOIN category_tree ct ON c."parentId" = ct.id
    )
    SELECT slug
    FROM category_tree
    WHERE slug != ${parentSlug}
    ORDER BY slug;
  `

  return result.map(({ slug }) => slug)
}
