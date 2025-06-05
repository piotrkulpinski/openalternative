"use server"

import { ReportType } from "@prisma/client"
import { headers } from "next/headers"
import { z } from "zod"
import { createServerAction } from "zsa"
import { auth } from "~/lib/auth"
import { getIP, isRateLimited } from "~/lib/rate-limiter"
import { userProcedure } from "~/lib/safe-actions"
import { feedbackSchema, reportSchema } from "~/server/web/shared/schema"
import { db } from "~/services/db"
import { tryCatch } from "~/utils/helpers"

export const reportTool = userProcedure
  .createServerAction()
  .input(reportSchema.extend({ toolSlug: z.string() }))
  .handler(async ({ input: { toolSlug, type, message }, ctx: { user } }) => {
    const ip = await getIP()
    const rateLimitKey = `report:${ip}`

    if (await isRateLimited(rateLimitKey, "report")) {
      // Rate limiting check
      throw new Error("Too many requests. Please try again later.")
    }

    const result = await tryCatch(
      db.report.create({
        data: {
          type,
          message,
          tool: { connect: { slug: toolSlug } },
          user: { connect: { id: user.id } },
        },
      }),
    )

    if (result.error) {
      console.error("Failed to report tool:", result.error)
      return { success: false, error: "Failed to report tool. Please try again later." }
    }

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

    const result = await tryCatch(
      db.report.create({
        data: {
          type: ReportType.Other,
          message,
          userId: session?.user.id,
        },
      }),
    )

    if (result.error) {
      console.error("Failed to send feedback:", result.error)
      return { success: false, error: "Failed to send feedback. Please try again later." }
    }

    return { success: true }
  })
