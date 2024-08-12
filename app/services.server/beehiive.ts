import { got } from "got"
import { z } from "zod"
import { SITE_NAME } from "~/utils/constants"
import { isRealEmail } from "~/utils/helpers"

export const subscriberSchema = z.object({
  email: z
    .string()
    .email("Invalid email address, please use a correct format.")
    .refine(isRealEmail, "Invalid email address, please use a real one."),
  referring_site: z
    .string()
    .optional()
    .default(process.env.VITE_SITE_URL ?? ""),
  utm_source: z.string().optional().default(SITE_NAME),
  utm_medium: z.string().optional().default("subscribe_form"),
  utm_campaign: z.string().optional().default("organic"),
  double_opt_override: z.string().optional().default("off"),
  reactivate_existing: z.boolean().optional().default(true),
  send_welcome_email: z.boolean().optional().default(true),
})

export const subscribeToBeehiive = async (formData: FormData) => {
  const url = `https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}/subscriptions`
  const authorization = `Bearer ${process.env.BEEHIIV_API_KEY}`

  const result = await subscriberSchema.safeParseAsync(Object.fromEntries(formData.entries()))

  if (!result.success) {
    throw result.error.flatten()
  }

  try {
    // Subscribe to the publication
    await got.post(url, { json: result.data, headers: { authorization } }).json()
  } catch (error) {
    if (error instanceof Error) {
      throw error.message
    }

    throw error
  }
}
