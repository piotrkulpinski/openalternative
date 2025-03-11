"use server"

import { slugify } from "@curiousleaf/utils"
import { db } from "@openalternative/db"
import { revalidatePath, revalidateTag } from "next/cache"
import { after } from "next/server"
import { z } from "zod"
import { isProd } from "~/env"
import { removeS3Directories, uploadFavicon } from "~/lib/media"
import { adminProcedure } from "~/lib/safe-actions"
import { alternativeSchema } from "~/server/admin/alternatives/schemas"
import { inngest } from "~/services/inngest"

export const createAlternative = adminProcedure
  .createServerAction()
  .input(alternativeSchema)
  .handler(async ({ input: { tools, ...input } }) => {
    const alternative = await db.alternative.create({
      data: {
        ...input,
        slug: input.slug || slugify(input.name),
        tools: { connect: tools?.map(id => ({ id })) },
      },
    })

    revalidateTag("alternatives")

    isProd &&
      (await inngest.send({ name: "alternative.created", data: { slug: alternative.slug } }))

    return alternative
  })

export const updateAlternative = adminProcedure
  .createServerAction()
  .input(alternativeSchema.extend({ id: z.string() }))
  .handler(async ({ input: { id, tools, ...input } }) => {
    const alternative = await db.alternative.update({
      where: { id },
      data: {
        ...input,
        tools: { set: tools?.map(id => ({ id })) },
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

export const reuploadAlternativeAssets = adminProcedure
  .createServerAction()
  .input(z.object({ id: z.string() }))
  .handler(async ({ input: { id } }) => {
    const alternative = await db.alternative.findUniqueOrThrow({
      where: { id },
    })

    const faviconUrl = await uploadFavicon(
      alternative.websiteUrl,
      `alternatives/${alternative.slug}/favicon`,
    )

    await db.alternative.update({
      where: { id: alternative.id },
      data: { faviconUrl },
    })

    revalidateTag("alternatives")
    revalidateTag(`alternative-${alternative.slug}`)

    return true
  })
