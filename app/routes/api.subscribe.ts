import { type ActionFunctionArgs, type TypedResponse, json } from "@remix-run/node"
import { got } from "got"
import { type ZodFormattedError, z } from "zod"

const isRealEmail = async (email: string) => {
  const disposableJsonURL =
    "https://rawcdn.githack.com/disposable/disposable-email-domains/master/domains.json"
  const response = await got(disposableJsonURL).json<string[]>()
  const domain = email.split("@")[1]

  return !response.includes(domain)
}

const subscriberSchema = z.object({
  email: z
    .string()
    .email("Invalid email address, please use a correct format.")
    .refine(isRealEmail, "Invalid email address, please use a real one."),
  referring_site: z
    .string()
    .optional()
    .default(process.env.VITE_SITE_URL ?? ""),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  reactivate_existing: z.boolean().optional().default(true),
  send_welcome_email: z.boolean().optional().default(true),
})

export type ActionState =
  | { type: "error"; error: ZodFormattedError<z.infer<typeof subscriberSchema>> }
  | { type: "success"; message: string }

export async function action({ request }: ActionFunctionArgs): Promise<TypedResponse<ActionState>> {
  const data = await request.formData()
  const parsed = await subscriberSchema.safeParseAsync(Object.fromEntries(data.entries()))
  const url = `https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}/subscriptions`
  const authorization = `Bearer ${process.env.BEEHIIV_API_KEY}`

  if (!parsed.success) {
    return json({ type: "error", error: parsed.error.format() })
  }

  // Subscribe to the publication
  await got.post(url, { json: parsed.data, headers: { authorization } }).json()

  // Return a success response
  return json({ type: "success", message: "Thank you for subscribing!" })
}
