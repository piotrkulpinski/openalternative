import "server-only"

import type { Prisma } from "@openalternative/db"
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
    const fromDate = from ? new Date(from) : undefined
    const toDate = to ? new Date(to) : undefined

    console.log(name)

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
    const [data, total] = await prisma.$transaction([
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

    const pageCount = Math.ceil(total / per_page)
    return { data, pageCount }
  } catch (err) {
    return { data: [], pageCount: 0 }
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
