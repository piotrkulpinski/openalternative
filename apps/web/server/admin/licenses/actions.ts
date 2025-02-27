"use server"

import { slugify } from "@curiousleaf/utils"
import { db } from "@openalternative/db"
import { revalidateTag } from "next/cache"
import { z } from "zod"
import { adminProcedure } from "~/lib/safe-actions"
import { licenseSchema } from "~/server/admin/licenses/schemas"

export const createLicense = adminProcedure
  .createServerAction()
  .input(licenseSchema)
  .handler(async ({ input }) => {
    const license = await db.license.create({
      data: {
        ...input,
        slug: input.slug || slugify(input.name),
      },
    })

    revalidateTag("licenses")

    return license
  })

export const updateLicense = adminProcedure
  .createServerAction()
  .input(licenseSchema.extend({ id: z.string() }))
  .handler(async ({ input: { id, ...input } }) => {
    const license = await db.license.update({
      where: { id },
      data: input,
    })

    revalidateTag("licenses")
    revalidateTag(`license-${license.slug}`)

    return license
  })

export const deleteLicenses = adminProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ input: { ids } }) => {
    await db.license.deleteMany({
      where: { id: { in: ids } },
    })

    revalidateTag("licenses")

    return true
  })
