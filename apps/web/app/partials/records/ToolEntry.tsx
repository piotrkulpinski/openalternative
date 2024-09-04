import type { SerializeFrom } from "@remix-run/node"
import { Link, unstable_useViewTransitionState } from "@remix-run/react"
import { Badge } from "apps/web/app/components/Badge"
import { Button } from "apps/web/app/components/Button"
import { Card } from "apps/web/app/components/Card"
import { FaviconImage } from "apps/web/app/components/Favicon"
import { H2 } from "apps/web/app/components/Heading"
import { Markdown } from "apps/web/app/components/Markdown"
import { Series } from "apps/web/app/components/Series"
import type { ToolMany } from "apps/web/app/services.server/api"
import { cx } from "apps/web/app/utils/cva"
import { ArrowRightIcon } from "lucide-react"
import type { HTMLAttributes } from "react"

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
        <Series
          size="lg"
          className="before:content-['#'_counter(alternatives)] before:absolute before:right-full before:-mr-3 before:font-semibold before:text-3xl before:opacity-25 max-lg:before:hidden"
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

          {tool.discountAmount && (
            <Badge variant="success" className="md:text-sm">
              {tool.discountCode
                ? `Use code ${tool.discountCode} for ${tool.discountAmount}% off`
                : `${tool.discountAmount}% off`}
            </Badge>
          )}
        </Series>

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
        <Link to={to} prefetch="intent" unstable_viewTransition>
          <img
            key={tool.screenshotUrl}
            src={tool.screenshotUrl}
            alt={`Screenshot of ${tool.name} website`}
            width={1280}
            height={1024}
            loading="eager"
            className="aspect-video h-auto w-full rounded-md border object-cover object-top"
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
