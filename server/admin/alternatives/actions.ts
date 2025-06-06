"use server"

import { slugify } from "@primoui/utils"
import { revalidatePath, revalidateTag } from "next/cache"
import { after } from "next/server"
import { z } from "zod"
import { removeS3Directories } from "~/lib/media"
import { adminProcedure } from "~/lib/safe-actions"
import { alternativeSchema } from "~/server/admin/alternatives/schema"
import { db } from "~/services/db"

export const upsertAlternative = adminProcedure
  .createServerAction()
  .input(alternativeSchema)
  .handler(async ({ input: { id, tools, ...input } }) => {
    const toolIds = tools?.map(id => ({ id }))

    const alternative = id
      ? await db.alternative.update({
          where: { id },
          data: {
            ...input,
            slug: input.slug || slugify(input.name),
            tools: { set: toolIds },
          },
        })
      : await db.alternative.create({
          data: {
            ...input,
            slug: input.slug || slugify(input.name),
            tools: { connect: toolIds },
          },
        })

    revalidateTag("alternatives")
    revalidateTag(`alternative-${alternative.slug}`)

    return alternative
  })

export const deleteAlternatives = adminProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ input: { ids } }) => {
    const alternatives = await db.alternative.findMany({
      where: { id: { in: ids } },
      select: { slug: true },
    })

    await db.alternative.deleteMany({
      where: { id: { in: ids } },
    })

    revalidatePath("/admin/alternatives")
    revalidateTag("alternatives")

    // Remove the alternative images from S3 asynchronously
    after(async () => {
      await removeS3Directories(alternatives.map(alt => `alternatives/${alt.slug}`))
    })

    return true
  })
