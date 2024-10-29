"use server"

import "server-only"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { alternativeSchema } from "~/app/(dashboard)/alternatives/_lib/validations"
import { uploadFavicon } from "~/lib/media"
import { authedProcedure } from "~/lib/safe-actions"
import { inngest } from "~/services/inngest"
import { prisma } from "~/services/prisma"
import { getSlug } from "~/utils/helpers"

export const createAlternative = authedProcedure
  .createServerAction()
  .input(alternativeSchema)
  .handler(async ({ input: { tools, ...input } }) => {
    const alternative = await prisma.alternative.create({
      data: {
        ...input,
        slug: input.slug || getSlug(input.name),

        tools: {
          create: tools?.map(id => ({
            tool: { connect: { id } },
          })),
        },
      },
    })

    revalidatePath("/alternatives")

    await inngest.send({ name: "alternative.created", data: { slug: alternative.slug } })

    return alternative
  })

export const updateAlternative = authedProcedure
  .createServerAction()
  .input(alternativeSchema.extend({ id: z.string() }))
  .handler(async ({ input: { id, tools, ...input } }) => {
    const alternative = await prisma.alternative.update({
      where: { id },
      data: {
        ...input,

        tools: {
          deleteMany: { alternativeId: id },

          create: tools?.map(id => ({
            tool: { connect: { id } },
          })),
        },
      },
    })

    revalidatePath("/alternatives")
    revalidatePath(`/alternatives/${alternative.id}`)

    return alternative
  })

export const updateAlternatives = authedProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()), data: alternativeSchema.partial() }))
  .handler(async ({ input: { ids, data } }) => {
    await prisma.alternative.updateMany({
      where: { id: { in: ids } },
      data,
    })

    revalidatePath("/alternatives")

    return true
  })

export const deleteAlternatives = authedProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ input: { ids } }) => {
    const alternatives = await prisma.alternative.findMany({
      where: { id: { in: ids } },
      select: { slug: true },
    })

    await prisma.alternative.deleteMany({
      where: { id: { in: ids } },
    })

    revalidatePath("/alternatives")

    for (const alternative of alternatives) {
      await inngest.send({ name: "alternative.deleted", data: { slug: alternative.slug } })
    }

    return true
  })

export const reuploadAlternativeAssets = authedProcedure
  .createServerAction()
  .input(z.object({ id: z.string() }))
  .handler(async ({ input: { id } }) => {
    const alternative = await prisma.alternative.findUniqueOrThrow({
      where: { id },
    })

    const faviconUrl = await uploadFavicon(
      alternative.website,
      `alternatives/${alternative.slug}/favicon`,
    )

    await prisma.alternative.update({
      where: { id: alternative.id },
      data: { faviconUrl },
    })

    return true
  })
