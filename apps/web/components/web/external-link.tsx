"use client"

import { getUrlHostname } from "@curiousleaf/utils"
import Link from "next/link"
import { type Properties, posthog } from "posthog-js"
import type { ComponentProps } from "react"
import { siteConfig } from "~/config/site"
import { addSearchParams } from "~/utils/search-params"

type ExternalLinkProps = ComponentProps<"a"> & {
  doFollow?: boolean
  eventName?: string
  eventProps?: Properties
}

export const ExternalLink = ({
  href,
  target = "_blank",
  doFollow = false,
  eventName,
  eventProps,
  ...props
}: ExternalLinkProps) => {
  const hostname = getUrlHostname(siteConfig.url)
  const hasTracking = href?.includes("ref=") || href?.includes("utm_")
  const finalHref = hasTracking ? href : addSearchParams(href!, { ref: hostname })

  return (
    <Link
      href={finalHref!}
      target={target}
      rel={`noopener noreferrer ${doFollow ? "" : "nofollow"}`}
      onClick={() => eventName && posthog.capture(eventName, eventProps)}
      {...props}
    />
  )
}
