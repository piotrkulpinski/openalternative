import { isTruthy } from "@curiousleaf/utils"
import { db } from "@openalternative/db"
import type { Prisma } from "@openalternative/db/client"
import { endOfDay, startOfDay } from "date-fns"
import type { UsersTableSchema } from "./schemas"

export const findUsers = async (search: UsersTableSchema) => {
  const { name, page, perPage, sort, from, to, operator } = search

  // Offset to paginate the results
  const offset = (page - 1) * perPage

  // Column and order to sort by
  const orderBy = sort.map(item => ({ [item.id]: item.desc ? "desc" : "asc" }) as const)

  // Convert the date strings to date objects
  const fromDate = from ? startOfDay(new Date(from)) : undefined
  const toDate = to ? endOfDay(new Date(to)) : undefined

  const expressions: (Prisma.UserWhereInput | undefined)[] = [
    // Filter by name
    name
      ? {
          OR: [
            { name: { contains: name, mode: "insensitive" } },
            { email: { contains: name, mode: "insensitive" } },
          ],
        }
      : undefined,

    // Filter by createdAt
    fromDate || toDate ? { createdAt: { gte: fromDate, lte: toDate } } : undefined,
  ]

  const where: Prisma.UserWhereInput = {
    [operator.toUpperCase()]: expressions.filter(isTruthy),
  }

  // Transaction is used to ensure both queries are executed in a single transaction
  const [users, usersTotal] = await db.$transaction([
    db.user.findMany({
      where,
      orderBy,
      take: perPage,
      skip: offset,
    }),

    db.user.count({
      where,
    }),
  ])

  const pageCount = Math.ceil(usersTotal / perPage)
  return { users, usersTotal, pageCount }
}

export const findUserById = async (id: string) => {
  return db.user.findUnique({
    where: { id },
  })
}
