"use server"

import { db } from "@openalternative/db"
import { revalidateTag } from "next/cache"
import { z } from "zod"
import { adminProcedure } from "~/lib/safe-actions"

export const deleteReports = adminProcedure
  .createServerAction()
  .input(z.object({ ids: z.array(z.string()) }))
  .handler(async ({ input: { ids } }) => {
    await db.report.deleteMany({
      where: { id: { in: ids } },
    })

    revalidateTag("reports")

    return true
  })
