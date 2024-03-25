import { ActionFunctionArgs, TypedResponse, json } from "@remix-run/node"
import { got } from "got"
import { ZodFormattedError, z } from "zod"

const subscriberSchema = z.object({
  email: z.string().email().min(1),
  groups: z.array(z.string()).optional(),
})

export type ActionState =
  | { type: "error"; error: ZodFormattedError<z.infer<typeof subscriberSchema>> }
  | { type: "success"; message: string }

export async function action({ request }: ActionFunctionArgs): Promise<TypedResponse<ActionState>> {
  const data = await request.formData()
  const parsed = subscriberSchema.safeParse(Object.fromEntries(data.entries()))

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
