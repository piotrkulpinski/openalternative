"use server"

import { revalidatePath } from "next/cache"
import { after } from "next/server"
import { z } from "zod"
import { removeS3Directories } from "~/lib/media"
import { adminProcedure } from "~/lib/safe-actions"
import { reportSchema } from "~/server/admin/reports/schema"
import { db } from "~/services/db"

export const updateReport = adminProcedure
  .createServerAction()
  .input(reportSchema.extend({ id: z.string() }))
  .handler(async ({ input: { id, ...input } }) => {
    const report = await db.report.update({
      where: { id },
      data: input,
    })

    revalidatePath("/admin/reports")

    return report
  })

export const deleteReports = adminProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ input: { ids } }) => {
    await db.report.deleteMany({
      where: { id: { in: ids } },
    })

    revalidatePath("/admin/reports")

    // Remove the report images from S3 asynchronously
    after(async () => {
      await removeS3Directories(ids.map(id => `reports/${id}`))
    })

    return true
  })
