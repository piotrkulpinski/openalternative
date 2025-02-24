import { isTruthy } from "@curiousleaf/utils"
import { db } from "@openalternative/db"
import type { Prisma } from "@openalternative/db/client"
import { endOfDay, startOfDay } from "date-fns"
import type { GetReportsSchema } from "./validations"

export const findReports = async (search: GetReportsSchema) => {
  const { page, perPage, sort, message, type, operator, from, to } = search

  // Offset to paginate the results
  const offset = (page - 1) * perPage

  // Column and order to sort by
  const orderBy = sort.map(item => ({ [item.id]: item.desc ? "desc" : "asc" }) as const)

  // Convert the date strings to date objects
  const fromDate = from ? startOfDay(new Date(from)) : undefined
  const toDate = to ? endOfDay(new Date(to)) : undefined

  const expressions: (Prisma.ReportWhereInput | undefined)[] = [
    // Filter by message
    message ? { message: { contains: message, mode: "insensitive" } } : undefined,

    // Filter by type
    type.length > 0 ? { type: { in: type } } : undefined,

    // Filter by createdAt
    fromDate || toDate ? { createdAt: { gte: fromDate, lte: toDate } } : undefined,
  ]

  const where: Prisma.ReportWhereInput = {
    [operator.toUpperCase()]: expressions.filter(isTruthy),
  }

  // Transaction is used to ensure both queries are executed in a single transaction
  const [reports, reportsTotal] = await db.$transaction([
    db.report.findMany({
      where,
      orderBy,
      include: { tool: true },
      take: perPage,
      skip: offset,
    }),

    db.report.count({
      where,
    }),
  ])

  const pageCount = Math.ceil(reportsTotal / perPage)
  return { reports, reportsTotal, pageCount }
}
