"use client"

import { NuqsAdapter } from "nuqs/adapters/next/app"
import posthog from "posthog-js"
import { PostHogProvider } from "posthog-js/react"
import type { PropsWithChildren } from "react"
import { PosthogPageview } from "~/components/common/posthog-pageview"
import { env } from "~/env"

if (typeof window !== "undefined") {
  posthog.init(env.NEXT_PUBLIC_POSTHOG_API_KEY, {
    ui_host: env.NEXT_PUBLIC_POSTHOG_HOST,
    api_host: "/_proxy/posthog/ingest",
    person_profiles: "identified_only",
    capture_pageview: false,
    capture_pageleave: true,
  })
}

export default function Providers({ children }: PropsWithChildren) {
  return (
    <PostHogProvider client={posthog}>
      <PosthogPageview />
      <NuqsAdapter>{children}</NuqsAdapter>
    </PostHogProvider>
  )
}
