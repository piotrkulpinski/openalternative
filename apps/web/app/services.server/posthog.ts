import { remember } from "@epic-web/remember"
import { PostHog } from "posthog-node"
import { v4 as uuidv4 } from "uuid"

/**
 * Creates and returns a PostHog instance.
 * @returns A PostHog instance configured with the API key and host from environment variables.
 */
export const posthog = remember("posthog", () => {
  return new PostHog(import.meta.env.NEXT_PUBLIC_POSTHOG_API_KEY ?? "", {
    host: import.meta.env.NEXT_PUBLIC_POSTHOG_API_HOST,
  })
})

/**
 * Retrieves the PostHog distinct ID from the request cookies or generates a new one.
 * @param request - The incoming request object.
 * @returns The PostHog distinct ID.
 */
export const getPostHogDistinctId = async (request: Request) => {
  const projectAPIKey = import.meta.env.NEXT_PUBLIC_POSTHOG_API_KEY
  const cookie = request.headers.get("cookie") || ""
  const cookieKey = `ph_${projectAPIKey}_posthog`

  const cookieMatch = cookie.match(new RegExp(`${cookieKey}=([^;]+)`))

  if (cookieMatch) {
    const parsedValue = JSON.parse(decodeURIComponent(cookieMatch[1]))

    if (parsedValue?.distinct_id) {
      return parsedValue.distinct_id as string
    }
  }

  return uuidv4()
}

/**
 * Retrieves the value of a PostHog feature flag for the current user.
 * @param  request - The incoming request object.
 * @param  flagName - The name of the feature flag to check.
 * @returns The value of the feature flag.
 */
export const getPostHogFlagValue = async (request: Request, flagName: string) => {
  const distinctId = await getPostHogDistinctId(request)

  return await posthog.getFeatureFlag(flagName, distinctId)
}

/**
 * Captures a PostHog event for the current user.
 * @param request - The incoming request object.
 * @param event - The name of the event to capture.
 * @param properties - Additional properties to include with the event.
 */
export const capturePostHogEvent = async (
  request: Request,
  event: string,
  properties: Record<string, any>,
) => {
  const distinctId = await getPostHogDistinctId(request)

  return posthog.capture({ distinctId, event, properties })
}
