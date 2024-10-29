import "server-only"

import type { Prisma } from "@openalternative/db"
import { endOfDay, startOfDay } from "date-fns"
import { unstable_noStore as noStore } from "next/cache"
import { prisma } from "~/services/prisma"
import type { SearchParams } from "~/types"
import { searchParamsSchema } from "./validations"

export async function getAlternatives(searchParams: SearchParams) {
  noStore()
  const search = searchParamsSchema.parse(searchParams)
  const { page, per_page, sort, name, operator, from, to } = search

  try {
    // Offset to paginate the results
    const offset = (page - 1) * per_page

    // Column and order to sort by
    // Spliting the sort string by "." to get the column and order
    // Example: "title.desc" => ["title", "desc"]
    const [column, order] = (sort?.split(".").filter(Boolean) ?? ["name", "asc"]) as [
      keyof Prisma.AlternativeOrderByWithRelationInput | undefined,
      "asc" | "desc" | undefined,
    ]

    // Convert the date strings to date objects
    const fromDate = from ? startOfDay(new Date(from)) : undefined
    const toDate = to ? endOfDay(new Date(to)) : undefined

    const where: Prisma.AlternativeWhereInput = {
      // Filter by name
      name: name ? { contains: name, mode: "insensitive" } : undefined,

      // Filter by createdAt
      createdAt: {
        gte: fromDate,
        lte: toDate,
      },
    }

    // Transaction is used to ensure both queries are executed in a single transaction
    const [alternatives, alternativesTotal] = await prisma.$transaction([
      prisma.alternative.findMany({
        where,
        orderBy: column ? { [column]: order } : undefined,
        take: per_page,
        skip: offset,
      }),

      prisma.alternative.count({
        where,
      }),
    ])

    const pageCount = Math.ceil(alternativesTotal / per_page)
    return { alternatives, alternativesTotal, pageCount }
  } catch (err) {
    return { alternatives: [], alternativesTotal: 0, pageCount: 0 }
  }
}

export async function getTools() {
  noStore()
  try {
    return await prisma.tool.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    })
  } catch (err) {
    return []
  }
}

export async function getAlternativeById(id: string) {
  noStore()
  try {
    return await prisma.alternative.findUnique({
      where: { id },
      include: { tools: { include: { tool: true } } },
    })
  } catch (err) {
    return null
  }
}
