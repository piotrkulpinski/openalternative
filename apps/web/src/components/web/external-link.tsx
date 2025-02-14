"use client"

import { type Properties, posthog } from "posthog-js"
import type { ComponentProps } from "react"
import { siteConfig } from "~/config/site"
import { addSearchParams } from "~/utils/search-params"

type ExternalLinkProps = ComponentProps<"a"> & {
  eventName?: string
  eventProps?: Properties
}

export const ExternalLink = ({
  href,
  target = "_blank",
  rel = "noopener noreferrer nofollow",
  eventName,
  eventProps,
  ...props
}: ExternalLinkProps) => {
  if (!href) return null

  return (
    <a
      href={addSearchParams(href, { ref: siteConfig.name.toLowerCase() })}
      target={target}
      rel={rel}
      onClick={() => eventName && posthog.capture(eventName, eventProps)}
      {...props}
    />
  )
}
