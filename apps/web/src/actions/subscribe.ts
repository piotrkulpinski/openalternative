"use server"

import wretch from "wretch"
import { createServerAction } from "zsa"
import { env } from "~/env"
import { newsletterSchema } from "~/server/schemas"
import { isRealEmail } from "~/utils/helpers"

/**
 * Subscribe to the newsletter
 * @param input - The newsletter data to subscribe to
 * @returns The newsletter that was subscribed to
 */
export const subscribeToNewsletter = createServerAction()
  .input(newsletterSchema)
  .handler(async ({ input: json }) => {
    const isValidEmail = await isRealEmail(json.email)

    if (!isValidEmail) {
      throw new Error("Invalid email address, please use a real one")
    }

    const url = `https://api.beehiiv.com/v2/publications/${env.BEEHIIV_PUBLICATION_ID}/subscriptions`

    const { data } = await wretch(url)
      .auth(`Bearer ${env.BEEHIIV_API_KEY}`)
      .post(json)
      .json<{ data: { status: string } }>()

    if (data?.status !== "active") {
      throw new Error("Failed to subscribe to newsletter")
    }

    return "You've been subscribed to the newsletter!"
  })
