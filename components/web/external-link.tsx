"use client"

import Link from "next/link"
import { type Properties, posthog } from "posthog-js"
import type { ComponentProps } from "react"

type ExternalLinkProps = ComponentProps<typeof Link> & {
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
  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      onClick={() => eventName && posthog.capture(eventName, eventProps)}
      {...props}
    />
  )
}
