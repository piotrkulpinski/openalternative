import type { Prisma } from "@prisma/client"
import { endOfDay, startOfDay } from "date-fns"
import type { SearchParams } from "nuqs/server"
import { cache } from "~/lib/cache"
import { prisma } from "~/services/prisma"
import { searchParamsSchema } from "./validations"

export const findAlternatives = cache(
  async (searchParams: SearchParams) => {
    const search = searchParamsSchema.parse(searchParams)
    const { page, per_page, sort, name, operator, from, to } = search

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
  },
  ["alternatives"],
)

export const findAlternativeList = cache(async () => {
  return prisma.alternative.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })
}, ["alternatives"])

export const findAlternativeBySlug = (slug: string) =>
  cache(
    async (slug: string) => {
      return prisma.alternative.findUnique({
        where: { slug },
        include: { tools: { include: { tool: true } } },
      })
    },
    [`alternative-${slug}`],
  )(slug)
