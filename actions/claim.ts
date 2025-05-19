"use server"

import { getUrlHostname } from "@curiousleaf/utils"
import { revalidateTag } from "next/cache"
import { headers } from "next/headers"
import { after } from "next/server"
import { z } from "zod"
import { config } from "~/config"
import EmailVerifyDomain from "~/emails/verify-domain"
import { auth } from "~/lib/auth"
import { sendEmail } from "~/lib/email"
import { getIP, isRateLimited } from "~/lib/rate-limiter"
import { userProcedure } from "~/lib/safe-actions"
import { db } from "~/services/db"

/**
 * Check rate limiting for claim actions
 */
const checkRateLimit = async (action: string) => {
  const ip = await getIP()
  const rateLimitKey = `claim-${action}:${ip}`

  if (await isRateLimited(rateLimitKey, "claim")) {
    throw new Error("Too many requests. Please try again later")
  }

  return { ip, rateLimitKey }
}

/**
 * Get tool by slug and verify it's claimable
 */
const getClaimableTool = async (slug: string) => {
  const tool = await db.tool.findUnique({
    where: { slug },
  })

  if (!tool) {
    throw new Error("Tool not found")
  }

  if (tool.ownerId) {
    throw new Error("This tool has already been claimed")
  }

  return tool
}

/**
 * Verify that email domain matches tool website domain
 */
const verifyEmailDomain = (email: string, toolWebsiteUrl: string) => {
  const toolDomain = getUrlHostname(toolWebsiteUrl)
  const emailDomain = email.split("@")[1]

  if (toolDomain !== emailDomain) {
    throw new Error("Email domain must match the tool's website domain")
  }
}

/**
 * Generate and send OTP email
 */
const generateAndSendOtp = async (email: string) => {
  const { token: otp } = await auth.api.generateOneTimeToken({
    headers: await headers(),
  })

  if (!otp) {
    throw new Error("Failed to send OTP")
  }

  // Send OTP email
  after(async () => {
    const to = email
    const subject = `Your ${config.site.name} Verification Code`
    await sendEmail({ to, subject, react: EmailVerifyDomain({ to, otp }) })
  })

  return otp
}

/**
 * Claim tool for a user and revalidate cache
 */
const claimToolForUser = async (toolId: string, userId: string, slug: string) => {
  await db.tool.update({
    where: { id: toolId },
    data: { ownerId: userId },
  })

  // Revalidate tools
  revalidateTag("tools")
  revalidateTag(`tool-${slug}`)
}

/**
 * Send OTP to verify domain ownership
 */
export const sendToolClaimOtp = userProcedure
  .createServerAction()
  .input(z.object({ toolSlug: z.string(), email: z.string().email() }))
  .handler(async ({ input: { toolSlug: slug, email } }) => {
    // Check rate limiting
    await checkRateLimit("otp")

    // Get and validate tool
    const tool = await getClaimableTool(slug)

    // Verify email domain
    verifyEmailDomain(email, tool.websiteUrl)

    // Generate and send OTP
    await generateAndSendOtp(email)

    return { success: true }
  })

/**
 * Verify OTP and claim tool
 */
export const verifyToolClaimOtp = userProcedure
  .createServerAction()
  .input(z.object({ toolSlug: z.string(), otp: z.string() }))
  .handler(async ({ input: { toolSlug: slug, otp } }) => {
    // Check rate limiting
    await checkRateLimit("verify")

    // Get and validate tool
    const tool = await getClaimableTool(slug)

    // Verify otp
    const { user } = await auth.api.verifyOneTimeToken({
      body: { token: otp },
    })

    // Claim tool and revalidate
    await claimToolForUser(tool.id, user.id, slug)

    return { success: true }
  })
