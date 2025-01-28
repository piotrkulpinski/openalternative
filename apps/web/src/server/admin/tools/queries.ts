import { isTruthy } from "@curiousleaf/utils"
import { db } from "@openalternative/db"
import { type Prisma, ToolStatus } from "@openalternative/db/client"
import { endOfDay, startOfDay } from "date-fns"
import type { SearchParams } from "nuqs/server"
import { cache } from "~/lib/cache"
import { searchParamsSchema } from "./validations"

export const findTools = cache(
  async (searchParams: SearchParams) => {
    const search = searchParamsSchema.parse(searchParams)
    const { page, per_page, sort, name, status, operator, from, to } = search

    // Offset to paginate the results
    const offset = (page - 1) * per_page

    // Column and order to sort by
    // Spliting the sort string by "." to get the column and order
    // Example: "title.desc" => ["title", "desc"]
    const [column, order] = (sort?.split(".").filter(Boolean) ?? ["createdAt", "desc"]) as [
      keyof Prisma.ToolOrderByWithRelationInput | undefined,
      "asc" | "desc" | undefined,
    ]

    // Convert the date strings to date objects
    const fromDate = from ? startOfDay(new Date(from)) : undefined
    const toDate = to ? endOfDay(new Date(to)) : undefined

    const expressions: (Prisma.ToolWhereInput | undefined)[] = [
      // Filter by name
      name ? { name: { contains: name, mode: "insensitive" } } : undefined,

      // Filter tasks by status
      status ? { status: { in: status.split(".") as ToolStatus[] } } : undefined,

      // Filter by createdAt
      fromDate || toDate ? { createdAt: { gte: fromDate, lte: toDate } } : undefined,
    ]

    const where: Prisma.ToolWhereInput = {
      [operator]: expressions.filter(isTruthy),
    }

    // Transaction is used to ensure both queries are executed in a single transaction
    const [tools, toolsTotal] = await db.$transaction([
      db.tool.findMany({
        where,
        orderBy: column ? { [column]: order } : undefined,
        take: per_page,
        skip: offset,
      }),

      db.tool.count({
        where,
      }),
    ])

    const pageCount = Math.ceil(toolsTotal / per_page)
    return { tools, toolsTotal, pageCount }
  },
  ["admin-tools", "tools"],
)

export const findScheduledTools = cache(async () => {
  return db.tool.findMany({
    where: { status: ToolStatus.Scheduled },
    select: { slug: true, name: true, publishedAt: true },
    orderBy: { publishedAt: "asc" },
  })
}, ["schedule"])

export const findToolList = cache(async () => {
  return db.tool.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })
}, ["admin-tools", "tools"])

export const findToolBySlug = (slug: string) =>
  cache(
    async (slug: string) => {
      return db.tool.findUnique({
        where: { slug },
        include: {
          alternatives: true,
          categories: true,
        },
      })
    },
    [`tool-${slug}`],
  )(slug)
