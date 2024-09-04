import { type ActionFunctionArgs, type TypedResponse, json } from "@remix-run/node"
import { subscribeToBeehiiv, type subscriberSchema } from "apps/web/app/services.server/beehiiv"
import { capturePostHogEvent } from "apps/web/app/services.server/posthog"
import type { z } from "zod"

type SubscribeError = z.inferFlattenedErrors<typeof subscriberSchema>

type ActionState = TypedResponse<
  { type: "error"; error: SubscribeError } | { type: "success"; message: string }
>

export async function action({ request }: ActionFunctionArgs): Promise<ActionState> {
  const data = await request.formData()

  try {
    // Subscribe to the newsletter
    await subscribeToBeehiiv(data)

    // Capture the event
    await capturePostHogEvent(request, "subscribed", {
      email: data.get("email"),
      medium: data.get("utm_medium"),
    })

    // Return a success response
    return json({ type: "success", message: "Thank you for subscribing!" })
  } catch (error) {
    return json({ type: "error", error: error as SubscribeError })
  }
}
