import { type ActionFunctionArgs, type TypedResponse, json } from "@remix-run/node"
import type { z } from "zod"
import { subscribeToBeehiiv, type subscriberSchema } from "~/services.server/beehiiv"
import { getUserPrefs, userPrefsCookie } from "~/services.server/cookies"
import { capturePostHogEvent } from "~/services.server/posthog"

type SubscribeError = z.inferFlattenedErrors<typeof subscriberSchema>

type ActionState = TypedResponse<
  { type: "error"; error: SubscribeError } | { type: "success"; message: string }
>

export async function action({ request }: ActionFunctionArgs): Promise<ActionState> {
  const data = await request.formData()
  const userPrefs = await getUserPrefs(request)
  const ip = request.headers.get("x-forwarded-for")

  try {
    if (ip) data.append("ip", ip)

    // Subscribe to the newsletter
    await subscribeToBeehiiv(data)

    // Capture the event
    await capturePostHogEvent(request, "subscribed", {
      email: data.get("email"),
      medium: data.get("utm_medium"),
    })

    // Set cookie
    userPrefs.hideNewsletter = true

    // Return a success response
    return json(
      { type: "success", message: "Thank you for subscribing!" },
      { headers: { "Set-Cookie": await userPrefsCookie.serialize(userPrefs) } },
    )
  } catch (error) {
    return json({ type: "error", error: error as SubscribeError })
  }
}
