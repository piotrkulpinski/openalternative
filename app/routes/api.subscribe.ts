import { ActionFunctionArgs, json } from "@remix-run/node"
import ky from "ky"
import { z } from "zod"

export async function action({ request }: ActionFunctionArgs) {
  const data = await request.formData()
  const email = data.get("email")

  const subscriberSchema = z.object({
    email: z.string().email().min(1),
    groups: z.array(z.string()).optional(),
  })

  const result = subscriberSchema.safeParse({ email })

  if (!result.success) {
    return json({ success: false, message: "Please provide a valid email." }, { status: 400 })
  }

  const response = await ky.post("https://connect.mailerlite.com/api/subscribers", {
    body: JSON.stringify(result.data),
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${process.env.MAILERLITE_API_TOKEN}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Fetch error: ${response}`)
  }

  // Return a success response
  return json({ success: true, message: "Thank you for subscribing!" })
}
