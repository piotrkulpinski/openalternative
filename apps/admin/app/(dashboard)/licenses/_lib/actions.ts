"use server"

import "server-only"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { licenseSchema } from "~/app/(dashboard)/licenses/_lib/validations"
import { authedProcedure } from "~/lib/safe-actions"
import { prisma } from "~/services/prisma"
import { getSlug } from "~/utils/helpers"

export const createLicense = authedProcedure
  .createServerAction()
  .input(licenseSchema)
  .handler(async ({ input }) => {
    const license = await prisma.license.create({
      data: {
        ...input,
        slug: input.slug || getSlug(input.name),
      },
    })

    revalidatePath("/licenses")

    return license
  })

export const updateLicense = authedProcedure
  .createServerAction()
  .input(licenseSchema.extend({ id: z.string() }))
  .handler(async ({ input: { id, ...input } }) => {
    const license = await prisma.license.update({
      where: { id },
      data: input,
    })

    revalidatePath("/licenses")
    revalidatePath(`/licenses/${license.id}`)

    return license
  })

export const updateLicenses = authedProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()), data: licenseSchema.partial() }))
  .handler(async ({ input: { ids, data } }) => {
    await prisma.license.updateMany({
      where: { id: { in: ids } },
      data,
    })

    revalidatePath("/licenses")

    return true
  })

export const deleteLicenses = authedProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ input: { ids } }) => {
    await prisma.license.deleteMany({
      where: { id: { in: ids } },
    })

    revalidatePath("/licenses")

    return true
  })
