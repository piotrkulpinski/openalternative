"use client"

import { getUrlHostname } from "@curiousleaf/utils"
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
  return (
    <a
      href={addSearchParams(href!, { ref: getUrlHostname(siteConfig.url) })}
      target={target}
      rel={`noopener noreferrer ${doFollow ? "" : "nofollow"}`}
      onClick={() => eventName && posthog.capture(eventName, eventProps)}
      {...props}
    />
  )
}
