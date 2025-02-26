import { isTruthy } from "@curiousleaf/utils"
import { db } from "@openalternative/db"
import type { Prisma } from "@openalternative/db/client"
import { endOfDay, startOfDay } from "date-fns"
import type { FindLicensesSchema } from "./schemas"

export const findLicenses = async (search: FindLicensesSchema) => {
  const { name, page, perPage, sort, from, to, operator } = search

  // Offset to paginate the results
  const offset = (page - 1) * perPage

  // Column and order to sort by
  const orderBy = sort.map(item => ({ [item.id]: item.desc ? "desc" : "asc" }) as const)

  // Convert the date strings to date objects
  const fromDate = from ? startOfDay(new Date(from)) : undefined
  const toDate = to ? endOfDay(new Date(to)) : undefined

  const expressions: (Prisma.LicenseWhereInput | undefined)[] = [
    // Filter by name
    name ? { name: { contains: name, mode: "insensitive" } } : undefined,

    // Filter by createdAt
    fromDate || toDate ? { createdAt: { gte: fromDate, lte: toDate } } : undefined,
  ]

  const where: Prisma.LicenseWhereInput = {
    [operator.toUpperCase()]: expressions.filter(isTruthy),
  }

  // Transaction is used to ensure both queries are executed in a single transaction
  const [licenses, licensesTotal] = await db.$transaction([
    db.license.findMany({
      where,
      orderBy,
      take: perPage,
      skip: offset,
    }),

    db.license.count({
      where,
    }),
  ])

  const pageCount = Math.ceil(licensesTotal / perPage)
  return { licenses, licensesTotal, pageCount }
}

export const findLicenseBySlug = async (slug: string) => {
  return db.license.findUnique({
    where: { slug },
  })
}
