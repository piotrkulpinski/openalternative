"use client"

import { getUrlHostname, isExternalUrl } from "@primoui/utils"
import { type Properties, posthog } from "posthog-js"
import type { ComponentProps } from "react"
import { siteConfig } from "~/config/site"
import { addSearchParams } from "~/utils/search-params"

type ExternalLinkProps = ComponentProps<"a"> & {
  doTrack?: boolean
  doFollow?: boolean
  eventName?: string
  eventProps?: Properties
}

export const ExternalLink = ({
  href,
  target = "_blank",
  doTrack = true,
  doFollow = false,
  eventName,
  eventProps,
  ...props
}: ExternalLinkProps) => {
  const hostname = getUrlHostname(siteConfig.url)
  const addTracking = doTrack && !href?.includes("utm_")
  const finalHref = addTracking ? addSearchParams(href!, { utm_source: hostname }) : href
  const isExternal = isExternalUrl(finalHref)

  return (
    <a
      href={finalHref!}
      target={target}
      rel={`noopener${doFollow ? "" : " nofollow"}`}
      onClick={() => isExternal && eventName && posthog.capture(eventName, eventProps)}
      {...props}
    />
  )
}
