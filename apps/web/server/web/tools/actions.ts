"use server"

import { getUrlHostname } from "@curiousleaf/utils"
import { db } from "@openalternative/db"
import { addMinutes } from "date-fns"
import { revalidateTag } from "next/cache"
import { z } from "zod"
import { ToolClaimOtpEmail } from "~/emails/tool-claim-otp"
import { sendEmails } from "~/lib/email"
import { getIP, isRateLimited } from "~/lib/rate-limiter"
import { userProcedure } from "~/lib/safe-actions"
import { getRandomDigits } from "~/utils/helpers"

// OTP expiration time in minutes
const OTP_EXPIRATION_MINUTES = 10

/**
 * Send OTP to verify domain ownership
 */
export const sendToolClaimOtp = userProcedure
  .createServerAction()
  .input(z.object({ toolSlug: z.string(), email: z.string().email() }))
  .handler(async ({ input: { toolSlug: slug, email } }) => {
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
    const otp = getRandomDigits(6)
    const expiresAt = addMinutes(new Date(), OTP_EXPIRATION_MINUTES)
    const to = email
    const subject = `Verify domain ownership for ${tool.name}`

    // Store OTP in database
    await db.claim.create({
      data: { toolId: tool.id, email, otp, expiresAt },
    })

    // Send OTP email
    await sendEmails({
      to,
      subject,
      react: ToolClaimOtpEmail({ tool, otp, expiresIn: OTP_EXPIRATION_MINUTES, to, subject }),
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
