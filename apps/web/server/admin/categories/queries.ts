import { isTruthy } from "@curiousleaf/utils"
import { db } from "@openalternative/db"
import type { Prisma } from "@openalternative/db/client"
import { endOfDay, startOfDay } from "date-fns"
import type { CategoriesTableSchema } from "./schemas"

export const findCategories = async (search: CategoriesTableSchema) => {
  const { name, page, perPage, sort, from, to, operator } = search

  // Offset to paginate the results
  const offset = (page - 1) * perPage

  // Column and order to sort by
  const orderBy = sort.map(item => ({ [item.id]: item.desc ? "desc" : "asc" }) as const)

  // Convert the date strings to Date objects and adjust the range
  const fromDate = from ? startOfDay(new Date(from)) : undefined
  const toDate = to ? endOfDay(new Date(to)) : undefined

  const expressions: (Prisma.CategoryWhereInput | undefined)[] = [
    // Filter by name
    name ? { name: { contains: name, mode: "insensitive" } } : undefined,

    // Filter by createdAt
    fromDate || toDate ? { createdAt: { gte: fromDate, lte: toDate } } : undefined,
  ]

  const where: Prisma.CategoryWhereInput = {
    [operator.toUpperCase()]: expressions.filter(isTruthy),
  }

  // Transaction is used to ensure both queries are executed in a single transaction
  const [categories, categoriesTotal] = await db.$transaction([
    db.category.findMany({
      where,
      orderBy,
      take: perPage,
      skip: offset,
    }),

    db.category.count({
      where,
    }),
  ])

  const pageCount = Math.ceil(categoriesTotal / perPage)
  return { categories, categoriesTotal, pageCount }
}

export const findCategoryList = async ({ ...args }: Prisma.CategoryFindManyArgs = {}) => {
  return db.category.findMany({
    ...args,
    select: { id: true, name: true, fullPath: true, parentId: true },
    orderBy: { name: "asc" },
  })
}

export const findCategoryBySlug = async (slug: string) => {
  return db.category.findUnique({
    where: { slug },
    include: {
      tools: { select: { id: true, name: true } },
      subcategories: { select: { id: true, name: true } },
    },
  })
}
