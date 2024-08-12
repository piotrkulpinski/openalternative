import { type ActionFunctionArgs, type TypedResponse, json } from "@remix-run/node"
import type { z } from "zod"
import { subscribeToBeehiive, type subscriberSchema } from "~/services.server/beehiive"

type SubscribeError = z.inferFlattenedErrors<typeof subscriberSchema>

export type ActionState = TypedResponse<
  { type: "error"; error: SubscribeError } | { type: "success"; message: string }
>

export async function action({ request }: ActionFunctionArgs): Promise<ActionState> {
  const data = await request.formData()

  try {
    // Subscribe to the newsletter
    await subscribeToBeehiive(data)

    // Return a success response
    return json({ type: "success", message: "Thank you for subscribing!" })
  } catch (error) {
    return json({ type: "error", error: error as SubscribeError })
  }
}
