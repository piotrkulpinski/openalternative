import "server-only"

import type { Prisma } from "@openalternative/db"
import { endOfDay, startOfDay } from "date-fns"
import { unstable_noStore as noStore } from "next/cache"
import { prisma } from "~/services/prisma"
import type { GetToolsSchema } from "./validations"

export async function getTools(input: GetToolsSchema) {
  noStore()
  const { page, per_page, sort, name, operator, from, to } = input

  try {
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

    const where: Prisma.ToolWhereInput = {
      // Filter by name
      name: name ? { contains: name, mode: "insensitive" } : undefined,

      // Filter by createdAt
      createdAt: {
        gte: fromDate,
        lte: toDate,
      },
    }

    // const expressions: (SQL<unknown> | undefined)[] = [
    //   title
    //     ? filterColumn({
    //         column: tasks.title,
    //         value: title,
    //       })
    //     : undefined,
    //   // Filter tasks by status
    //   status
    //     ? filterColumn({
    //         column: tasks.status,
    //         value: status,
    //         isSelectable: true,
    //       })
    //     : undefined,
    //   // Filter tasks by priority
    //   priority
    //     ? filterColumn({
    //         column: tasks.priority,
    //         value: priority,
    //         isSelectable: true,
    //       })
    //     : undefined,
    //   // Filter by createdAt
    //   fromDay && toDay
    //     ? and(gte(tasks.createdAt, fromDay), lte(tasks.createdAt, toDay))
    //     : undefined,
    // ]
    // const where: DrizzleWhere<Tool> =
    //   !operator || operator === "and" ? and(...expressions) : or(...expressions)

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
  } catch (err) {
    return { tools: [], toolsTotal: 0, pageCount: 0 }
  }
}

export async function getAlternatives() {
  noStore()
  try {
    return await prisma.alternative.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    })
  } catch (err) {
    return []
  }
}

export async function getCategories() {
  noStore()
  try {
    return await prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    })
  } catch (err) {
    return []
  }
}

export async function getToolCountByStatus() {
  noStore()
  try {
    return await prisma.tool.groupBy({
      by: ["publishedAt"],
      _count: {
        publishedAt: true,
      },
    })
  } catch (err) {
    return []
  }
}

export async function getToolById(id: string) {
  noStore()
  try {
    return await prisma.tool.findUnique({
      where: { id },
      include: {
        alternatives: { include: { alternative: true } },
        categories: { include: { category: true } },
      },
    })
  } catch (err) {
    return null
  }
}
