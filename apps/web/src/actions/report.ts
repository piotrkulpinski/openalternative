"use server"

import { db } from "@openalternative/db"
import { z } from "zod"
import { createServerAction } from "zsa"
import { getIP, isRateLimited } from "~/lib/rate-limiter"
import { reportSchema } from "~/server/schemas"

export const reportTool = createServerAction()
  .input(reportSchema.extend({ toolSlug: z.string() }))
  .handler(async ({ input: { toolSlug, type, message } }) => {
    const ip = await getIP()

    // Rate limiting check
    if (await isRateLimited(ip, "report")) {
      throw new Error("Too many requests. Please try again later.")
    }

    try {
      await db.report.create({
        data: {
          type,
          message,
          tool: { connect: { slug: toolSlug } },
        },
      })

      return { success: true }
    } catch (error) {
      console.error("Failed to report tool:", error)
      return { success: false, error: "Failed to report tool. Please try again later." }
    }
  })
