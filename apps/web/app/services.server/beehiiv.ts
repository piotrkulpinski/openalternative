import { got } from "got"
import { z } from "zod"
import { SITE_NAME } from "~/utils/constants"
import { isRealEmail } from "~/utils/email"

export const subscriberSchema = z.object({
  email: z
    .string()
    .email("Invalid email address, please use a correct format.")
    .refine(isRealEmail, "Invalid email address, please use a real one."),
  referring_site: z
    .string()
    .optional()
    .default(process.env.NEXT_PUBLIC_SITE_URL ?? ""),
  utm_source: z.string().optional().default(SITE_NAME),
  utm_medium: z.string().optional().default("subscribe_form"),
  utm_campaign: z.string().optional().default("organic"),
  double_opt_override: z.string().optional(),
  reactivate_existing: z.boolean().optional(),
  send_welcome_email: z.boolean().optional(),
  ip: z.string().optional(),
})

export const subscribeToBeehiiv = async (formData: FormData) => {
  const url = `https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}/subscriptions`
  const authorization = `Bearer ${process.env.BEEHIIV_API_KEY}`
  const entries = Object.fromEntries(formData.entries())

  const { data, success, error } = await subscriberSchema.safeParseAsync(entries)

  if (!success) {
    throw error.flatten()
  }

  const { ip, ...json } = data

  try {
    await got
      .post(url, {
        json: { ...json, custom_fields: ip ? [{ name: "ip", value: ip }] : undefined },
        headers: { authorization },
      })
      .json()
  } catch (error) {
    if (error instanceof Error) {
      throw error.message
    }

    throw error
  }
}
