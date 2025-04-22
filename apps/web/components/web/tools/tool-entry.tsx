import type { ComponentProps } from "react"
import { Button } from "~/components/common/button"
import { H2 } from "~/components/common/heading"
import { Icon } from "~/components/common/icon"
import { Link } from "~/components/common/link"
import { Stack } from "~/components/common/stack"
import { Markdown } from "~/components/web/markdown"
import { OverlayImage } from "~/components/web/overlay-image"
import { ToolBadges } from "~/components/web/tools/tool-badges"
import { FaviconImage } from "~/components/web/ui/favicon"
import { VerifiedBadge } from "~/components/web/verified-badge"
import type { ToolManyExtended, ToolOne } from "~/server/web/tools/payloads"
import { cx } from "~/utils/cva"

type ToolEntryProps = ComponentProps<"div"> & {
  tool: ToolOne | ToolManyExtended
}

const ToolEntry = ({ children, className, tool, ...props }: ToolEntryProps) => {
  const href = `/${tool.slug}`

  return (
    <div
      className={cx(
        "flex flex-col gap-6 scroll-mt-20 md:gap-8 [counter-increment:entries]",
        className,
      )}
      {...props}
    >
      <Stack size="lg" className="not-prose relative justify-between">
        <Stack
          className="self-start before:content-['#'_counter(entries)] before:font-semibold before:text-3xl before:opacity-25 xl:before:absolute xl:before:right-full xl:before:mr-4"
          asChild
        >
          <Link href={href} className="group">
            <FaviconImage src={tool.faviconUrl} title={tool.name} className="size-8" />

            <H2 className="!leading-tight truncate underline decoration-transparent group-hover:decoration-foreground/30">
              {tool.name}
            </H2>

            {tool.ownerId && <VerifiedBadge size="lg" />}
          </Link>
        </Stack>

        <ToolBadges tool={tool} className="ml-auto" />
      </Stack>

      {tool.description && (
        <p className="not-prose -mt-4 w-full text-secondary-foreground text-pretty md:text-lg md:-mt-6">
          {tool.description}
        </p>
      )}

      {tool.screenshotUrl && (
        <OverlayImage
          href={href}
          target="_self"
          doFollow={true}
          src={tool.screenshotUrl}
          alt={`Screenshot of ${tool.name} website`}
          className="not-prose"
        >
          Read more
        </OverlayImage>
      )}

      {children ? (
        <div>{children}</div>
      ) : (
        tool.content && (
          <div className="relative max-h-72 overflow-hidden">
            <Markdown code={tool.content} />

            <div className="absolute inset-0 top-auto h-1/5 bg-linear-to-t from-background pointer-events-none" />
          </div>
        )
      )}

      <Button suffix={<Icon name="lucide/arrow-right" />} className="not-prose self-start" asChild>
        <Link href={href}>Read more</Link>
      </Button>
    </div>
  )
}

export { ToolEntry }
