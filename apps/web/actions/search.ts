"use server"

import { db } from "@openalternative/db"
import { z } from "zod"
import { adminProcedure } from "~/lib/safe-actions"

export const searchItems = adminProcedure
  .createServerAction()
  .input(z.object({ query: z.string() }))
  .handler(async ({ input: { query } }) => {
    const start = performance.now()

    const [tools, alternatives, categories, licenses] = await Promise.all([
      db.tool.findMany({
        where: { name: { contains: query, mode: "insensitive" } },
        orderBy: { name: "asc" },
        take: 5,
      }),
      db.alternative.findMany({
        where: { name: { contains: query, mode: "insensitive" } },
        orderBy: { name: "asc" },
        take: 5,
      }),
      db.category.findMany({
        where: { name: { contains: query, mode: "insensitive" } },
        orderBy: { name: "asc" },
        take: 5,
      }),
      db.license.findMany({
        where: { name: { contains: query, mode: "insensitive" } },
        orderBy: { name: "asc" },
        take: 5,
      }),
    ])

    console.log(`Admin search: ${Math.round(performance.now() - start)}ms`)

    return { tools, alternatives, categories, licenses }
  })
