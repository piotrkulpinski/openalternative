"use server"

import wretch from "wretch"
import { createServerAction } from "zsa"
import { env } from "~/env"
import { getIP, isRateLimited } from "~/lib/rate-limiter"
import { newsletterSchema } from "~/server/web/shared/schemas"
import { isDisposableEmail, tryCatch } from "~/utils/helpers"

/**
 * Subscribe to the newsletter
 * @param input - The newsletter data to subscribe to
 * @returns The newsletter that was subscribed to
 */
export const subscribeToNewsletter = createServerAction()
  .input(newsletterSchema)
  .handler(async ({ input: { value: email, ...input } }) => {
    const ip = await getIP()
    const rateLimitKey = `newsletter:${ip}`

    // Rate limiting check
    if (await isRateLimited(rateLimitKey, "newsletter")) {
      throw new Error("Too many attempts. Please try again later.")
    }

    // Disposable email check
    if (await isDisposableEmail(email)) {
      throw new Error("Invalid email address, please use a real one")
    }

    const url = `https://api.beehiiv.com/v2/publications/${env.BEEHIIV_PUBLICATION_ID}/subscriptions`

    const { data, error } = await tryCatch(
      wretch(url)
        .auth(`Bearer ${env.BEEHIIV_API_KEY}`)
        .post({ email, ...input })
        .json<{ data: { status: string } }>(),
    )

    if (error) {
      throw new Error("Failed to subscribe to newsletter. Please try again later.")
    }

    if (data.data.status === "pending") {
      return "You've been subscribed to the newsletter, please check your email for confirmation."
    }

    return "You've been subscribed to the newsletter."
  })
