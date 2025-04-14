"use server"

import { getUrlHostname } from "@curiousleaf/utils"
import { getRandomDigits } from "@curiousleaf/utils"
import { db } from "@openalternative/db"
import { addSeconds } from "date-fns"
import { revalidateTag } from "next/cache"
import { after } from "next/server"
import { z } from "zod"
import { claimsConfig } from "~/config/claims"
import EmailToolClaimOtp from "~/emails/tool-claim-otp"
import { sendEmails } from "~/lib/email"
import { getIP, isRateLimited } from "~/lib/rate-limiter"
import { userProcedure } from "~/lib/safe-actions"

/**
 * Send OTP to verify domain ownership
 */
export const sendToolClaimOtp = userProcedure
  .createServerAction()
  .input(z.object({ toolSlug: z.string(), email: z.string().email() }))
  .handler(async ({ input: { toolSlug: slug, email }, ctx: { user } }) => {
    const ip = await getIP()
    const rateLimitKey = `claim-otp:${ip}`

    // Check if rate limited
    if (await isRateLimited(rateLimitKey, "claim")) {
      throw new Error("Too many requests. Please try again later")
    }

    // Get tool
    const tool = await db.tool.findUnique({
      where: { slug },
    })

    if (!tool) {
      throw new Error("Tool not found")
    }

    // Check if tool already claimed
    if (tool.ownerId) {
      throw new Error("This tool has already been claimed")
    }

    // Verify email domain matches tool domain
    const toolDomain = getUrlHostname(tool.websiteUrl)
    const emailDomain = email.split("@")[1]

    if (toolDomain !== emailDomain) {
      throw new Error("Email domain must match the tool's website domain")
    }

    // Generate OTP
    const otp = getRandomDigits(claimsConfig.otpLength)
    const expiresAt = addSeconds(new Date(), claimsConfig.otpExpiration)
    const to = email
    const subject = `Verify domain ownership for ${tool.name}`

    // Store OTP in database
    await db.claim.create({
      data: {
        toolId: tool.id,
        userId: user.id,
        email,
        otp,
        expiresAt,
      },
    })

    // Send OTP email
    after(async () => {
      await sendEmails({
        to,
        subject,
        react: EmailToolClaimOtp({ to, tool, otp }),
      })
    })

    return { success: true }
  })

/**
 * Verify OTP and claim tool
 */
export const verifyToolClaimOtp = userProcedure
  .createServerAction()
  .input(z.object({ toolSlug: z.string(), email: z.string().email(), otp: z.string() }))
  .handler(async ({ input: { toolSlug: slug, email, otp }, ctx: { user } }) => {
    const ip = await getIP()
    const rateLimitKey = `claim-verify:${ip}`

    // Check if rate limited
    if (await isRateLimited(rateLimitKey, "claim")) {
      throw new Error("Too many requests. Please try again later")
    }

    // Get tool
    const tool = await db.tool.findUnique({
      where: { slug },
    })

    if (!tool) {
      throw new Error("Tool not found")
    }

    // Check if tool already claimed
    if (tool.ownerId) {
      throw new Error("This tool has already been claimed")
    }

    // Find OTP
    const otpRecord = await db.claim.findFirst({
      where: {
        toolId: tool.id,
        userId: user.id,
        email,
        otp,
        expiresAt: { gt: new Date() },
      },
    })

    if (!otpRecord) {
      throw new Error("Invalid or expired OTP")
    }

    // Claim tool
    await db.tool.update({
      where: { id: tool.id },
      data: { ownerId: user.id },
    })

    // Revalidate tools
    revalidateTag("tools")
    revalidateTag(`tool-${slug}`)

    return { success: true }
  })
