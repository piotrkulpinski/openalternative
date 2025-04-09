"use server"

import { db } from "@openalternative/db"
import { ReportType } from "@openalternative/db/client"
import { headers } from "next/headers"
import { z } from "zod"
import { createServerAction } from "zsa"
import { auth } from "~/lib/auth"
import { getIP, isRateLimited } from "~/lib/rate-limiter"
import { userProcedure } from "~/lib/safe-actions"
import { feedbackSchema, reportSchema } from "~/server/web/shared/schemas"

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
        user: { connect: { id: user.id } },
        tool: { connect: { slug: toolSlug } },
      },
    })

    return { success: true }
  })

export const reportFeedback = createServerAction()
  .input(feedbackSchema)
  .handler(async ({ input: { message } }) => {
    const session = await auth.api.getSession({ headers: await headers() })
    const ip = await getIP()
    const rateLimitKey = `report:${ip}`

    // Rate limiting check
    if (await isRateLimited(rateLimitKey, "report")) {
      throw new Error("Too many requests. Please try again later.")
    }

    await db.report.create({
      data: {
        type: ReportType.Other,
        message,
        userId: session?.user.id,
      },
    })

    return { success: true }
  })
