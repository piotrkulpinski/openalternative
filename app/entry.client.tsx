import { RemixBrowser } from "@remix-run/react"
import { StrictMode, startTransition, useEffect } from "react"
import { hydrateRoot } from "react-dom/client"
import { posthog } from "posthog-js"

const PosthogInit = () => {
  useEffect(() => {
    posthog.init(import.meta.env.VITE_POSTHOG_API_KEY!, {
      api_host: import.meta.env.VITE_POSTHOG_API_HOST,
      capture_pageview: false,
      capture_pageleave: false,
    })
  }, [])

  return null
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
      <PosthogInit />
    </StrictMode>
  )
})
