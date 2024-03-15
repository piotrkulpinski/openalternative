"use client"

import posthog from "posthog-js"
import { PostHogProvider as PHProvider } from "posthog-js/react"
import { PropsWithChildren } from "react"
import { env } from "~/env"

if (typeof window !== "undefined") {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
    capture_pageview: false, // Disable automatic pageview capture, as we capture manually
  })
}

export function PostHogProvider({ children }: PropsWithChildren) {
  return <PHProvider client={posthog}>{children}</PHProvider>
}
