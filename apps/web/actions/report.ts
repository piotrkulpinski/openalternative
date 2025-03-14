"use server"

import { db } from "@openalternative/db"
import { z } from "zod"
import { getIP, isRateLimited } from "~/lib/rate-limiter"
import { userProcedure } from "~/lib/safe-actions"
import { reportSchema } from "~/server/web/shared/schemas"

export const reportTool = userProcedure
  .createServerAction()
  .input(reportSchema.extend({ toolSlug: z.string() }))
  .handler(async ({ input: { toolSlug, type, message }, ctx: { user } }) => {
    const ip = await getIP()
    const rateLimitKey = `report:${ip}`

    // Rate limiting check
    if (await isRateLimited(rateLimitKey, "report")) {
      throw new Error("Too many requests. Please try again later.")
    }

    await db.report.create({
      data: {
        type,
        message,
        tool: { connect: { slug: toolSlug } },
        user: { connect: { id: user.id } },
      },
    })

    return { success: true }
  })
