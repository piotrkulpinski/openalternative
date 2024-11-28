import { isTruthy } from "@curiousleaf/utils"
import type { Prisma } from "@prisma/client"
import { endOfDay, startOfDay } from "date-fns"
import type { SearchParams } from "nuqs/server"
import { prisma } from "~/services/prisma"
import { searchParamsSchema } from "./validations"

export const getTools = async (searchParams: Promise<SearchParams>) => {
  const search = searchParamsSchema.parse(await searchParams)
  const { page, per_page, sort, name, publishedAt, operator, from, to } = search

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
    name
      ? {
          name: { contains: name, mode: "insensitive" },
        }
      : undefined,

    // Filter tasks by status
    publishedAt
      ? {
          publishedAt: publishedAt.includes("draft")
            ? null
            : publishedAt.includes("scheduled")
              ? { gt: new Date() }
              : { lte: new Date() },
        }
      : undefined,

    // Filter by createdAt
    fromDate || toDate
      ? {
          createdAt: { gte: fromDate, lte: toDate },
        }
      : undefined,
  ]

  const where: Prisma.ToolWhereInput = {
    [operator]: expressions.filter(isTruthy),
  }

  // Transaction is used to ensure both queries are executed in a single transaction
  const [tools, toolsTotal] = await prisma.$transaction([
    prisma.tool.findMany({
      where,
      orderBy: column ? { [column]: order } : undefined,
      take: per_page,
      skip: offset,
    }),

    prisma.tool.count({
      where,
    }),
  ])

  const pageCount = Math.ceil(toolsTotal / per_page)
  return { tools, toolsTotal, pageCount }
}

export const getAlternatives = async () => {
  return prisma.alternative.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })
}

export const getCategories = async () => {
  return prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })
}

export const getToolCountByStatus = async () => {
  return prisma.tool.groupBy({
    by: ["publishedAt"],
    _count: {
      publishedAt: true,
    },
  })
}

export const getToolBySlug = async (slug: string) => {
  return prisma.tool.findUnique({
    where: { slug },
    include: {
      alternatives: { include: { alternative: true } },
      categories: { include: { category: true } },
    },
  })
}
