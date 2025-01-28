import { db } from "@openalternative/db"
import type { Prisma } from "@openalternative/db/client"
import { endOfDay, startOfDay } from "date-fns"
import type { SearchParams } from "nuqs/server"
import { cache } from "~/lib/cache"
import { searchParamsSchema } from "./validations"

export const findCategories = cache(
  async (searchParams: SearchParams) => {
    const search = searchParamsSchema.parse(searchParams)
    const { page, per_page, sort, name, operator, from, to } = search

    // Offset to paginate the results
    const offset = (page - 1) * per_page

    // Column and order to sort by
    // Spliting the sort string by "." to get the column and order
    // Example: "title.desc" => ["title", "desc"]
    const [column, order] = (sort?.split(".").filter(Boolean) ?? ["name", "asc"]) as [
      keyof Prisma.CategoryOrderByWithRelationInput | undefined,
      "asc" | "desc" | undefined,
    ]

    // Convert the date strings to Date objects and adjust the range
    const fromDate = from ? startOfDay(new Date(from)) : undefined
    const toDate = to ? endOfDay(new Date(to)) : undefined

    const where: Prisma.CategoryWhereInput = {
      // Filter by name
      name: name ? { contains: name, mode: "insensitive" } : undefined,

      // Filter by createdAt
      createdAt: {
        gte: fromDate,
        lte: toDate,
      },
    }

    // Transaction is used to ensure both queries are executed in a single transaction
    const [categories, categoriesTotal] = await db.$transaction([
      db.category.findMany({
        where,
        orderBy: column ? { [column]: order } : undefined,
        take: per_page,
        skip: offset,
      }),

      db.category.count({
        where,
      }),
    ])

    const pageCount = Math.ceil(categoriesTotal / per_page)
    return { categories, categoriesTotal, pageCount }
  },
  ["admin-categories", "categories"],
)

export const findCategoryList = cache(async () => {
  return db.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })
}, ["admin-categories", "categories"])

export const findCategoryBySlug = (slug: string) =>
  cache(
    async (slug: string) => {
      return db.category.findUnique({
        where: { slug },
        include: { tools: true },
      })
    },
    [`category-${slug}`],
  )(slug)
