import { isTruthy } from "@curiousleaf/utils"
import { db } from "@openalternative/db"
import { type Prisma, ToolStatus } from "@openalternative/db/client"
import { endOfDay, startOfDay } from "date-fns"
import type { ToolsTableSchema } from "./schemas"

export const findTools = async (search: ToolsTableSchema, where?: Prisma.ToolWhereInput) => {
  const { name, sort, page, perPage, from, to, operator, status } = search

  // Offset to paginate the results
  const offset = (page - 1) * perPage

  // Column and order to sort by
  const orderBy = sort.map(item => ({ [item.id]: item.desc ? "desc" : "asc" }) as const)

  // Convert the date strings to date objects
  const fromDate = from ? startOfDay(new Date(from)) : undefined
  const toDate = to ? endOfDay(new Date(to)) : undefined

  const expressions: (Prisma.ToolWhereInput | undefined)[] = [
    // Filter by name
    name ? { name: { contains: name, mode: "insensitive" } } : undefined,

    // Filter by createdAt
    fromDate || toDate ? { createdAt: { gte: fromDate, lte: toDate } } : undefined,

    // Filter tasks by status
    status.length > 0 ? { status: { in: status } } : undefined,
  ]

  const whereQuery: Prisma.ToolWhereInput = {
    [operator.toUpperCase()]: expressions.filter(isTruthy),
  }

  // Transaction is used to ensure both queries are executed in a single transaction
  const [tools, toolsTotal] = await db.$transaction([
    db.tool.findMany({
      where: { ...whereQuery, ...where },
      orderBy,
      take: perPage,
      skip: offset,
    }),

    db.tool.count({
      where: { ...whereQuery, ...where },
    }),
  ])

  const pageCount = Math.ceil(toolsTotal / perPage)
  return { tools, toolsTotal, pageCount }
}

export const findScheduledTools = async () => {
  return db.tool.findMany({
    where: { status: ToolStatus.Scheduled },
    select: { slug: true, name: true, publishedAt: true },
    orderBy: { publishedAt: "asc" },
  })
}

export const findToolList = async () => {
  return db.tool.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })
}

export const findToolBySlug = async (slug: string) => {
  return db.tool.findUnique({
    where: { slug },
    include: {
      alternatives: true,
      categories: true,
    },
  })
}
