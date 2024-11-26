"use client"

import { getUrlHostname } from "@curiousleaf/utils"
import { ArrowUpRightIcon } from "lucide-react"
import { posthog } from "posthog-js"
import type { ComponentProps } from "react"
import { Button } from "~/components/web/ui/button"
import type { ToolOne } from "~/server/tools/payloads"

type ToolLinkProps = ComponentProps<typeof Button> & {
  tool: ToolOne
}

export const ToolLink = ({ tool, ...props }: ToolLinkProps) => {
  return (
    <Button
      suffix={<ArrowUpRightIcon />}
      onClick={() =>
        posthog.capture("tool_clicked", {
          slug: tool.slug,
          websiteUrl: tool.websiteUrl,
          isFeatured: tool.isFeatured,
        })
      }
      asChild
      {...props}
    >
      <a
        href={tool.affiliateUrl || tool.websiteUrl}
        target="_blank"
        rel={`noreferrer noopener ${tool.isFeatured ? "" : "nofollow"}`}
      >
        <span className="sm:hidden">Visit</span>
        <span className="max-sm:hidden">{getUrlHostname(tool.websiteUrl)}</span>
      </a>
    </Button>
  )
}
