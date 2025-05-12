"use server"

import { z } from "zod"
import { createServerAction } from "zsa"
import { db } from "~/services/db"

export const searchItems = createServerAction()
  .input(z.object({ query: z.string() }))
  .handler(async ({ input: { query } }) => {
    const start = performance.now()

    const [tools, alternatives, categories, licenses] = await Promise.all([
      db.tool.findMany({
        where: { name: { contains: query, mode: "insensitive" } },
        orderBy: { name: "asc" },
        take: 10,
      }),

      db.alternative.findMany({
        where: { name: { contains: query, mode: "insensitive" } },
        orderBy: { name: "asc" },
        take: 10,
      }),

      db.category.findMany({
        where: { name: { contains: query, mode: "insensitive" } },
        orderBy: { name: "asc" },
        take: 10,
      }),

      db.license.findMany({
        where: { name: { contains: query, mode: "insensitive" } },
        orderBy: { name: "asc" },
        take: 10,
      }),
    ])

    console.log(`Admin search: ${Math.round(performance.now() - start)}ms`)

    return { tools, alternatives, categories, licenses }
  })
