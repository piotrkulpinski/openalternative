"use server"

import { ToolStatus } from "@prisma/client"
import { revalidateTag } from "next/cache"
import { indexAlternatives, indexCategories, indexTools } from "~/lib/indexing"
import { recalculatePrices } from "~/lib/pricing"
import { getToolRepositoryData } from "~/lib/repositories"
import { adminProcedure } from "~/lib/safe-actions"
import { db } from "~/services/db"
import { tryCatch } from "~/utils/helpers"

export const fetchRepositoryData = adminProcedure.createServerAction().handler(async () => {
  const tools = await db.tool.findMany({
    where: {
      status: { in: [ToolStatus.Scheduled, ToolStatus.Published] },
    },
  })

  if (tools.length === 0) {
    return { success: false, message: "No tools found" }
  }

  await Promise.allSettled(
    tools.map(async tool => {
      const result = await tryCatch(getToolRepositoryData(tool.repositoryUrl))

      if (result.error) {
        console.error(`Failed to fetch repository data for ${tool.name}`, {
          error: result.error,
          slug: tool.slug,
        })

        return null
      }

      if (!result.data) {
        return null
      }

      await db.tool.update({
        where: { id: tool.id },
        data: result.data,
      })
    }),
  )

  // Revalidate cache
  revalidateTag("tools")
  revalidateTag("tool")
})

export const indexAllData = adminProcedure.createServerAction().handler(async () => {
  await Promise.all([indexTools({}), indexAlternatives({}), indexCategories({})])
})

export const recalculatePricesData = adminProcedure.createServerAction().handler(async () => {
  const alternatives = await db.alternative.findMany()

  await recalculatePrices(alternatives, async ({ id, adPrice }) => {
    await db.alternative.update({ where: { id }, data: { adPrice } })
  })

  revalidateTag("alternatives")
})
