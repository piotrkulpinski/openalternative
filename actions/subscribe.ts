"use server"

import ky from "ky"
import { z } from "zod"
import { env } from "~/env"

const subscriberSchema = z.object({
  email: z.string().email().min(1),
})

export const subscribe = async (formData: FormData) => {
  const subscriber = subscriberSchema.parse({
    email: formData.get("email"),
  })

  const response = await ky.post("https://connect.mailerlite.com/api/subscribers", {
    body: JSON.stringify(subscriber),
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${env.MAILERLITE_API_TOKEN}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Fetch error: ${response}`)
  }

  return response.json()
}
