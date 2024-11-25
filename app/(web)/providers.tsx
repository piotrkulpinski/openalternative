"use client"

import PlausibleProvider from "next-plausible"
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
    <PlausibleProvider
      domain={env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
      customDomain={env.NEXT_PUBLIC_PLAUSIBLE_HOST}
      selfHosted
    >
      <PostHogProvider client={posthog}>
        <PosthogPageview />
        {children}
      </PostHogProvider>
    </PlausibleProvider>
  )
}
