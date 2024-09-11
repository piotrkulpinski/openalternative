import { RemixBrowser } from "@remix-run/react"
import { posthog } from "posthog-js"
import { StrictMode, startTransition, useEffect } from "react"
import { hydrateRoot } from "react-dom/client"

const PosthogInit = () => {
  useEffect(() => {
    posthog.init(import.meta.env.NEXT_PUBLIC_POSTHOG_API_KEY ?? "", {
      api_host: import.meta.env.NEXT_PUBLIC_POSTHOG_API_HOST,
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
    </StrictMode>,
  )
})
