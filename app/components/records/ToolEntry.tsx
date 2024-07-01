import type { SerializeFrom } from "@remix-run/node"
import { Link, unstable_useViewTransitionState } from "@remix-run/react"
import type { HTMLAttributes } from "react"
import type { ToolMany } from "~/services.server/api"
import { Card } from "../Card"
import { FaviconImage } from "../Favicon"
import { H2 } from "../Heading"
import { Markdown } from "../Markdown"
import { Series } from "../Series"
import { ArrowUpRightIcon, GithubIcon } from "lucide-react"
import { Button } from "../Button"
import { updateUrlWithSearchParams } from "~/utils/queryString"
import posthog from "posthog-js"
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
        <Series
          size="lg"
          className="before:content-['#'_counter(alternatives)] before:absolute before:right-full before:-mr-3 before:font-semibold before:text-3xl before:opacity-25 max-lg:before:hidden"
        >
          <FaviconImage
            src={tool.faviconUrl}
            title={tool.name}
            style={{ viewTransitionName: vt ? `tool-${tool.id}-favicon` : undefined }}
          />

          <H2
            className="!leading-snug"
            style={{ viewTransitionName: vt ? `tool-${tool.id}-name` : undefined }}
          >
            <Link to={to} prefetch="intent" unstable_viewTransition className="hover:underline">
              {tool.name}
            </Link>
          </H2>
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
        <Markdown style={{ viewTransitionName: vt ? `tool-${tool.id}-content` : undefined }}>
          {tool.content}
        </Markdown>
      )}

      <Series>
        {tool.website && (
          <Button
            suffix={<ArrowUpRightIcon />}
            onClick={() => posthog.capture("website_clicked", { url: tool.website })}
            asChild
          >
            <a
              href={updateUrlWithSearchParams(tool.website, { ref: "openalternative" })}
              target="_blank"
              rel="nofollow noreferrer"
            >
              View Website
            </a>
          </Button>
        )}

        {tool.repository && (
          <Button
            variant="secondary"
            prefix={<GithubIcon />}
            onClick={() => posthog.capture("repository_clicked", { url: tool.repository })}
            asChild
          >
            <a href={tool.repository} target="_blank" rel="noreferrer nofollow">
              Repository
            </a>
          </Button>
        )}
      </Series>
    </div>
  )
}
