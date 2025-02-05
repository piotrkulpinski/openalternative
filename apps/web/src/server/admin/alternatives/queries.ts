import { isTruthy } from "@curiousleaf/utils"
import { db } from "@openalternative/db"
import type { Prisma } from "@openalternative/db/client"
import { endOfDay, startOfDay } from "date-fns"
import type { GetAlternativesSchema } from "./validations"

export const findAlternatives = async (search: GetAlternativesSchema) => {
  const { page, perPage, sort, name, operator, from, to } = search

  // Offset to paginate the results
  const offset = (page - 1) * perPage

  // Column and order to sort by
  const orderBy = sort.map(item => ({ [item.id]: item.desc ? "desc" : "asc" }) as const)

  // Convert the date strings to date objects
  const fromDate = from ? startOfDay(new Date(from)) : undefined
  const toDate = to ? endOfDay(new Date(to)) : undefined

  const expressions: (Prisma.AlternativeWhereInput | undefined)[] = [
    // Filter by name
    name ? { name: { contains: name, mode: "insensitive" } } : undefined,

    // Filter by createdAt
    fromDate || toDate ? { createdAt: { gte: fromDate, lte: toDate } } : undefined,
  ]

  const where: Prisma.AlternativeWhereInput = {
    [operator.toUpperCase()]: expressions.filter(isTruthy),
  }

  // Transaction is used to ensure both queries are executed in a single transaction
  const [alternatives, alternativesTotal] = await db.$transaction([
    db.alternative.findMany({
      where,
      orderBy,
      take: perPage,
      skip: offset,
    }),

    db.alternative.count({
      where,
    }),
  ])

  const pageCount = Math.ceil(alternativesTotal / perPage)
  return { alternatives, alternativesTotal, pageCount }
}

export const findAlternativeList = async () => {
  return db.alternative.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })
}

export const findAlternativeBySlug = async (slug: string) => {
  return db.alternative.findUnique({
    where: { slug },
    include: { tools: true },
  })
}
