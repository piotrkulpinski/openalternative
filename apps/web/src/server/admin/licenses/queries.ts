import { db } from "@openalternative/db"
import type { Prisma } from "@openalternative/db/client"
import { endOfDay, startOfDay } from "date-fns"
import type { SearchParams } from "nuqs/server"
import { cache } from "~/lib/cache"
import { searchParamsSchema } from "./validations"

export const findLicenses = cache(
  async (searchParams: SearchParams) => {
    const search = searchParamsSchema.parse(searchParams)
    const { page, per_page, sort, name, operator, from, to } = search

    // Offset to paginate the results
    const offset = (page - 1) * per_page

    // Column and order to sort by
    // Spliting the sort string by "." to get the column and order
    // Example: "title.desc" => ["title", "desc"]
    const [column, order] = (sort?.split(".").filter(Boolean) ?? ["name", "asc"]) as [
      keyof Prisma.LicenseOrderByWithRelationInput | undefined,
      "asc" | "desc" | undefined,
    ]

    // Convert the date strings to date objects
    const fromDate = from ? startOfDay(new Date(from)) : undefined
    const toDate = to ? endOfDay(new Date(to)) : undefined

    const where: Prisma.LicenseWhereInput = {
      // Filter by name
      name: name ? { contains: name, mode: "insensitive" } : undefined,

      // Filter by createdAt
      createdAt: {
        gte: fromDate,
        lte: toDate,
      },
    }

    // Transaction is used to ensure both queries are executed in a single transaction
    const [licenses, licensesTotal] = await db.$transaction([
      db.license.findMany({
        where,
        orderBy: column ? { [column]: order } : undefined,
        take: per_page,
        skip: offset,
      }),

      db.license.count({
        where,
      }),
    ])

    const pageCount = Math.ceil(licensesTotal / per_page)
    return { licenses, licensesTotal, pageCount }
  },
  ["admin-licenses", "licenses"],
)

export const findLicenseBySlug = (slug: string) =>
  cache(
    async (slug: string) => {
      return db.license.findUnique({
        where: { slug },
      })
    },
    [`license-${slug}`],
  )(slug)
