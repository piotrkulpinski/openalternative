"use server"

import "server-only"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { toolSchema } from "~/app/(dashboard)/tools/_lib/validations"
import { uploadFavicon, uploadScreenshot } from "~/lib/media"
import { authedProcedure } from "~/lib/safe-actions"
import { inngest } from "~/services/inngest"
import { prisma } from "~/services/prisma"
import { getSlug } from "~/utils/helpers"

export const createTool = authedProcedure
  .createServerAction()
  .input(toolSchema)
  .handler(async ({ input: { alternatives, categories, ...input } }) => {
    const tool = await prisma.tool.create({
      data: {
        ...input,
        slug: input.slug || getSlug(input.name),

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

    revalidatePath("/tools")

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

    revalidatePath("/tools")
    revalidatePath(`/tools/${tool.id}`)

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

    revalidatePath("/tools")

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

    revalidatePath("/tools")

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
      data: { publishedAt },
    })

    revalidatePath("/tools")
    revalidatePath(`/tools/${tool.id}`)

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
      uploadFavicon(tool.website, `${tool.slug}/favicon`),
      uploadScreenshot(tool.website, `${tool.slug}/screenshot`),
    ])

    await prisma.tool.update({
      where: { id: tool.id },
      data: { faviconUrl, screenshotUrl },
    })
  })
