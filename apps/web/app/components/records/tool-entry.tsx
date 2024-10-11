import type { SerializeFrom } from "@remix-run/node"
import { Link, unstable_useViewTransitionState } from "@remix-run/react"
import { ArrowRightIcon } from "lucide-react"
import type { HTMLAttributes } from "react"
import { ToolBadges } from "~/components/records/tool-badges"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Card } from "~/components/ui/card"
import { FaviconImage } from "~/components/ui/favicon"
import { H2 } from "~/components/ui/heading"
import { Markdown } from "~/components/ui/markdown"
import { Stack } from "~/components/ui/stack"
import type { ToolMany } from "~/services.server/api"
import { cx } from "~/utils/cva"

type Tool = ToolMany | SerializeFrom<ToolMany>

type ToolEntryProps = HTMLAttributes<HTMLElement> & {
  tool: Tool
}

export const ToolEntry = ({ className, tool, ...props }: ToolEntryProps) => {
  const to = `/${tool.slug}`
  const vt = unstable_useViewTransitionState(to)

  return (
    <div
      className={cx("flex flex-col gap-6 md:gap-8 [counter-increment:alternatives]", className)}
      style={{ viewTransitionName: vt ? `tool-${tool.id}` : undefined }}
      {...props}
    >
      <div>
        <Stack
          size="lg"
          className="before:content-['#'_counter(alternatives)] before:tabular-nums before:absolute before:right-full before:-mr-3 before:font-semibold before:text-3xl before:opacity-25 max-lg:before:hidden"
        >
          <FaviconImage
            src={tool.faviconUrl}
            title={tool.name}
            style={{ viewTransitionName: vt ? `tool-${tool.id}-favicon` : undefined }}
          />

          <div className="flex flex-1">
            <H2
              style={{ viewTransitionName: vt ? `tool-${tool.id}-name` : undefined }}
              className="!leading-snug"
            >
              <Link to={to} prefetch="intent" unstable_viewTransition className="hover:underline">
                {tool.name}
              </Link>
            </H2>
          </div>

          <ToolBadges
            tool={tool}
            style={{ viewTransitionName: vt ? `tool-${tool.id}-badges` : undefined }}
          >
            {tool.discountAmount && (
              <Badge size="lg" variant="success">
                {tool.discountCode
                  ? `Use code ${tool.discountCode} for ${tool.discountAmount}!`
                  : `Get ${tool.discountAmount} with our link!`}
              </Badge>
            )}
          </ToolBadges>
        </Stack>

        {tool.description && (
          <Card.Description
            style={{ viewTransitionName: vt ? `tool-${tool.id}-description` : undefined }}
            className="mt-2 text-base w-full md:text-lg"
          >
            {tool.description}
          </Card.Description>
        )}
      </div>

      {tool.screenshotUrl && (
        <Link to={to} prefetch="intent" className="group" unstable_viewTransition>
          <img
            key={tool.screenshotUrl}
            src={tool.screenshotUrl}
            alt={`Screenshot of ${tool.name} website`}
            width={1280}
            height={1024}
            loading="lazy"
            className="aspect-video h-auto w-full rounded-md border object-cover object-top group-hover:brightness-95"
            style={{ viewTransitionName: vt ? `tool-${tool.id}-screenshot` : undefined }}
          />
        </Link>
      )}

      {tool.content && (
        <div
          className="relative max-h-72 overflow-hidden"
          style={{ viewTransitionName: vt ? `tool-${tool.id}-content` : undefined }}
        >
          <Markdown>{tool.content}</Markdown>

          <div className="absolute inset-0 top-auto h-1/5 bg-gradient-to-t from-background pointer-events-none" />
        </div>
      )}

      <Button suffix={<ArrowRightIcon />} className="self-start" asChild>
        <Link to={to} prefetch="intent" unstable_viewTransition>
          Read more
        </Link>
      </Button>
    </div>
  )
}
