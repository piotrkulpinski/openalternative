"use server"

import { ToolStatus } from "@prisma/client"
import { revalidateTag } from "next/cache"
import { indexTools } from "~/lib/indexing"
import { getToolRepositoryData } from "~/lib/repositories"
import { adminProcedure } from "~/lib/safe-actions"
import { toolOnePayload } from "~/server/web/tools/payloads"
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

export const indexData = adminProcedure.createServerAction().handler(async () => {
  const tools = await db.tool.findMany({
    where: { status: ToolStatus.Published },
    select: toolOnePayload,
  })

  if (tools.length) {
    await indexTools(tools)
  }
})
