import { randomUUID } from "node:crypto"
import { cookies } from "next/headers"
import { PostHog } from "posthog-node"
import { env, isProd } from "~/env"

export const posthog = new PostHog(env.NEXT_PUBLIC_POSTHOG_API_KEY, {
  host: env.NEXT_PUBLIC_POSTHOG_HOST,
})

export const getDistinctId = async () => {
  const cookieStore = await cookies()
  const distinctId = cookieStore.get("ph_distinct_id")

  if (distinctId) {
    return distinctId.value
  }

  // Generate new UUID and store in cookie
  const newDistinctId = randomUUID()
  cookieStore.set("ph_distinct_id", newDistinctId, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  })

  return newDistinctId
}
