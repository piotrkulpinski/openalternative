"use server"

import { getUrlHostname, slugify } from "@curiousleaf/utils"
import { db } from "@openalternative/db"
import { headers } from "next/headers"
import { createServerAction } from "zsa"
import { subscribeToNewsletter } from "~/actions/subscribe"
import { isProd } from "~/env"
import { auth } from "~/lib/auth"
import { getIP, isRateLimited } from "~/lib/rate-limiter"
import { submitToolSchema } from "~/server/web/shared/schemas"
import { inngest } from "~/services/inngest"
import { isDisposableEmail } from "~/utils/helpers"

/**
 * Generates a unique slug by adding a numeric suffix if needed
 */
const generateUniqueSlug = async (baseName: string): Promise<string> => {
  const baseSlug = slugify(baseName)
  let slug = baseSlug
  let suffix = 2

  while (true) {
    // Check if slug exists
    if (!(await db.tool.findUnique({ where: { slug } }))) {
      return slug
    }

    // Add/increment suffix and try again
    slug = `${baseSlug}-${suffix}`
    suffix++
  }
}

/**
 * Submit a tool to the database
 * @param input - The tool data to submit
 * @returns The tool that was submitted
 */
export const submitTool = createServerAction()
  .input(submitToolSchema)
  .handler(async ({ input: { newsletterOptIn, ...data } }) => {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
      const ip = await getIP()
      const rateLimitKey = `submission:${ip}`

      // Rate limiting check
      if (await isRateLimited(rateLimitKey, "submission")) {
        throw new Error("Too many submissions. Please try again later.")
      }

      // Disposable email check
      if (await isDisposableEmail(data.submitterEmail)) {
        throw new Error("Invalid email address, please use a real one")
      }
    }

    if (newsletterOptIn) {
      await subscribeToNewsletter({
        value: data.submitterEmail,
        utm_medium: "submit_form",
        send_welcome_email: false,
      })
    }

    // Check if the tool already exists
    const existingTool = await db.tool.findFirst({
      where: { OR: [{ repositoryUrl: data.repositoryUrl }, { websiteUrl: data.websiteUrl }] },
    })

    // If the tool exists, redirect to the tool or submit page
    if (existingTool) {
      return existingTool
    }

    // Generate a unique slug
    const slug = await generateUniqueSlug(data.name)

    // Check if the email domain matches the tool's website domain
    const ownerId = session?.user.email.includes(getUrlHostname(data.websiteUrl))
      ? session?.user.id
      : undefined

    // Save the tool to the database
    const tool = await db.tool.create({
      data: { ...data, slug, ownerId },
    })

    // Send an event to the Inngest pipeline
    isProd && (await inngest.send({ name: "tool.submitted", data: { slug } }))

    return tool
  })
