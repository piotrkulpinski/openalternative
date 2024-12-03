"use server"

import { slugify } from "@curiousleaf/utils"
import { ToolStatus } from "@prisma/client"
import { unstable_expireTag as expireTag } from "next/cache"
import { z } from "zod"
import { uploadFavicon, uploadScreenshot } from "~/lib/media"
import { authedProcedure } from "~/lib/safe-actions"
import { toolSchema } from "~/server/admin/tools/validations"
import { inngest } from "~/services/inngest"
import { prisma } from "~/services/prisma"

export const createTool = authedProcedure
  .createServerAction()
  .input(toolSchema)
  .handler(async ({ input: { alternatives, categories, ...input } }) => {
    const tool = await prisma.tool.create({
      data: {
        ...input,
        slug: input.slug || slugify(input.name),

        alternatives: {
          create: alternatives?.map(id => ({
            alternative: { connect: { id } },
          })),
        },

        categories: {
          create: categories?.map(id => ({
            category: { connect: { id } },
          })),
        },
      },
    })

    expireTag("tools")

    // Send an event to the Inngest pipeline
    if (tool.publishedAt) {
      await inngest.send({ name: "tool.scheduled", data: { slug: tool.slug } })
    }

    return tool
  })

export const updateTool = authedProcedure
  .createServerAction()
  .input(toolSchema.extend({ id: z.string() }))
  .handler(async ({ input: { id, alternatives, categories, ...input } }) => {
    const tool = await prisma.tool.update({
      where: { id },
      data: {
        ...input,

        alternatives: {
          deleteMany: { toolId: id },

          create: alternatives?.map(id => ({
            alternative: { connect: { id } },
          })),
        },

        categories: {
          deleteMany: { toolId: id },

          create: categories?.map(id => ({
            category: { connect: { id } },
          })),
        },
      },
    })

    expireTag("tools", `tool-${tool.slug}`)

    return tool
  })

export const updateTools = authedProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()), data: toolSchema.partial() }))
  .handler(async ({ input: { ids, data } }) => {
    await prisma.tool.updateMany({
      where: { id: { in: ids } },
      data,
    })

    expireTag("tools", "tool")

    return true
  })

export const deleteTools = authedProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ input: { ids } }) => {
    const tools = await prisma.tool.findMany({
      where: { id: { in: ids } },
      select: { slug: true },
    })

    await prisma.tool.deleteMany({
      where: { id: { in: ids } },
    })

    expireTag("tools")

    // Send an event to the Inngest pipeline
    for (const tool of tools) {
      await inngest.send({ name: "tool.deleted", data: { slug: tool.slug } })
    }

    return true
  })

export const scheduleTool = authedProcedure
  .createServerAction()
  .input(z.object({ id: z.string(), publishedAt: z.date() }))
  .handler(async ({ input: { id, publishedAt } }) => {
    const tool = await prisma.tool.update({
      where: { id },
      data: { status: ToolStatus.Scheduled, publishedAt },
    })

    expireTag("schedule", "tools", `tool-${tool.slug}`)

    // Send an event to the Inngest pipeline
    await inngest.send({ name: "tool.scheduled", data: { slug: tool.slug } })

    return true
  })

export const reuploadToolAssets = authedProcedure
  .createServerAction()
  .input(z.object({ id: z.string() }))
  .handler(async ({ input: { id } }) => {
    const tool = await prisma.tool.findUniqueOrThrow({ where: { id } })

    const [faviconUrl, screenshotUrl] = await Promise.all([
      uploadFavicon(tool.website, `tools/${tool.slug}/favicon`),
      uploadScreenshot(tool.website, `tools/${tool.slug}/screenshot`),
    ])

    await prisma.tool.update({
      where: { id: tool.id },
      data: { faviconUrl, screenshotUrl },
    })

    expireTag("tools", `tool-${tool.slug}`)

    return true
  })
