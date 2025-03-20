"use server"

import { db } from "@openalternative/db"
import { ToolStatus } from "@openalternative/db/client"
import { revalidateTag } from "next/cache"
import { z } from "zod"
import { getToolRepositoryData } from "~/lib/repositories"
import { adminProcedure } from "~/lib/safe-actions"
import { getPostTemplate, sendSocialPost } from "~/lib/socials"
import { tryCatch } from "~/utils/helpers"

export const testSocialPosts = adminProcedure
  .createServerAction()
  .input(z.object({ slug: z.string() }))
  .handler(async ({ input: { slug } }) => {
    const tool = await db.tool.findFirst({ where: { slug } })

    if (tool) {
      const template = await getPostTemplate(tool)
      return sendSocialPost(template, tool)
    }
  })

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
