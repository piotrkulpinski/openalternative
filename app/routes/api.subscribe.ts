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
  groups: z.array(z.string()).optional(),
})

export type ActionState =
  | { type: "error"; error: ZodFormattedError<z.infer<typeof subscriberSchema>> }
  | { type: "success"; message: string }

export async function action({ request }: ActionFunctionArgs): Promise<TypedResponse<ActionState>> {
  const data = await request.formData()
  const parsed = await subscriberSchema.safeParseAsync(Object.fromEntries(data.entries()))

  if (!parsed.success) {
    return json({ type: "error", error: parsed.error.format() })
  }

  await got
    .post("https://connect.mailerlite.com/api/subscribers", {
      json: parsed.data,
      headers: { authorization: `Bearer ${process.env.MAILERLITE_API_TOKEN}` },
    })
    .json()

  // Return a success response
  return json({ type: "success", message: "Thank you for subscribing!" })
}
