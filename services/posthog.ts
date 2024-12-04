"use server"

import { randomUUID } from "node:crypto"
import { cookies } from "next/headers"
import { PostHog } from "posthog-node"
import { env } from "~/env"

const posthog = new PostHog(env.NEXT_PUBLIC_POSTHOG_API_KEY, {
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
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  })

  return newDistinctId
}

export const captureEvent = async (event: string, properties?: Record<string | number, any>) => {
  const distinctId = await getDistinctId()
  posthog.capture({ distinctId, event, properties })
}
