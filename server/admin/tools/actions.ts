"use server"

import { slugify } from "@curiousleaf/utils"
import { ToolStatus } from "@prisma/client"
import { revalidatePath, revalidateTag } from "next/cache"
import { after } from "next/server"
import { z } from "zod"
import { removeS3Directories } from "~/lib/media"
import { notifySubmitterOfToolPublished } from "~/lib/notifications"
import { notifySubmitterOfToolScheduled } from "~/lib/notifications"
import { adminProcedure } from "~/lib/safe-actions"
import { analyzeRepositoryStack } from "~/lib/stack-analysis"
import { toolSchema } from "~/server/admin/tools/schema"
import { db } from "~/services/db"

export const upsertTool = adminProcedure
  .createServerAction()
  .input(toolSchema)
  .handler(async ({ input: { id, alternatives, categories, notifySubmitter, ...input } }) => {
    const alternativeIds = alternatives?.map(id => ({ id }))
    const categoryIds = categories?.map(id => ({ id }))
    const existingTool = id ? await db.tool.findUnique({ where: { id } }) : null

    const tool = id
      ? // If the tool exists, update it
        await db.tool.update({
          where: { id },
          data: {
            ...input,
            slug: input.slug || slugify(input.name),
            alternatives: { set: alternativeIds },
            categories: { set: categoryIds },
          },
        })
      : // Otherwise, create it
        await db.tool.create({
          data: {
            ...input,
            slug: input.slug || slugify(input.name),
            alternatives: { connect: alternativeIds },
            categories: { connect: categoryIds },
          },
        })

    // Revalidate the tools
    revalidateTag("tools")
    revalidateTag(`tool-${tool.slug}`)

    if (tool.status === ToolStatus.Scheduled) {
      // Revalidate the schedule if the tool is scheduled
      revalidateTag("schedule")
    }

    if (notifySubmitter && (!existingTool || existingTool.status !== tool.status)) {
      // Notify the submitter of the tool published
      after(async () => await notifySubmitterOfToolPublished(tool))

      // Notify the submitter of the tool scheduled for publication
      after(async () => await notifySubmitterOfToolScheduled(tool))
    }

    return tool
  })

export const deleteTools = adminProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ input: { ids } }) => {
    const tools = await db.tool.findMany({
      where: { id: { in: ids } },
      select: { slug: true },
    })

    await db.tool.deleteMany({
      where: { id: { in: ids } },
    })

    revalidatePath("/admin/tools")
    revalidateTag("tools")

    // Remove the tool images from S3 asynchronously
    after(async () => {
      await removeS3Directories(tools.map(tool => `tools/${tool.slug}`))
    })

    return true
  })

export const analyzeToolStack = adminProcedure
  .createServerAction()
  .input(z.object({ id: z.string() }))
  .handler(async ({ input: { id } }) => {
    const tool = await db.tool.findUniqueOrThrow({ where: { id } })

    // Get analysis and cache it
    const stack = await analyzeRepositoryStack(tool.repositoryUrl)

    // Update tool with new stack
    await db.tool.update({
      where: { id: tool.id },
      data: { stacks: { set: stack.map(slug => ({ slug })) } },
    })

    // Revalidate the tool
    revalidateTag(`tool-${tool.slug}`)
  })
