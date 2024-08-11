import { remember } from "@epic-web/remember"
import { parse } from "cookie"
import { PostHog } from "posthog-node"

export const posthog = remember("posthog", () => {
  return new PostHog(import.meta.env.VITE_POSTHOG_API_KEY ?? "", {
    host: import.meta.env.VITE_POSTHOG_API_HOST,
  })
})

export const getFeatureFlagValue = async (request: Request, flagName: string) => {
  const projectAPIKey = import.meta.env.VITE_POSTHOG_API_KEY
  const cookies = parse(request.headers.get("cookie") || "")
  const cookieKey = `ph_${projectAPIKey}_posthog`

  if (cookies[cookieKey]) {
    try {
      const distinctId = JSON.parse(cookies[cookieKey]).distinct_id
      return await posthog.getFeatureFlag(flagName, distinctId)
    } catch {}
  }

  return
}
