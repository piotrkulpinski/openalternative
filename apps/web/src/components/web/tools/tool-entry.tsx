import { ArrowRightIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { HTMLAttributes } from "react"
import { H2 } from "~/components/common/heading"
import { Stack } from "~/components/common/stack"
import { Markdown } from "~/components/web/markdown"
import { ToolBadges } from "~/components/web/tools/tool-badges"
import { Badge } from "~/components/web/ui/badge"
import { Button } from "~/components/web/ui/button"
import { FaviconImage } from "~/components/web/ui/favicon"
import type { ToolManyExtended } from "~/server/web/tools/payloads"
import { cx } from "~/utils/cva"

type ToolEntryProps = HTMLAttributes<HTMLElement> & {
  tool: ToolManyExtended
}

const ToolEntry = ({ className, tool, ...props }: ToolEntryProps) => {
  const href = `/${tool.slug}`

  return (
    <div
      className={cx("flex flex-col gap-6 md:gap-8 [counter-increment:alternatives]", className)}
      {...props}
    >
      <div>
        <Stack
          size="lg"
          className="before:content-['#'_counter(alternatives)] before:tabular-nums before:absolute before:right-full before:-mr-3 before:font-semibold before:text-3xl before:opacity-25 max-lg:before:hidden"
        >
          <FaviconImage src={tool.faviconUrl} title={tool.name} />

          <div className="flex flex-1">
            <H2 className="leading-snug!">
              <Link href={href} className="hover:underline" prefetch={false}>
                {tool.name}
              </Link>
            </H2>
          </div>

          <ToolBadges tool={tool}>
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
          <p className="mt-2 w-full text-secondary text-pretty md:text-lg">{tool.description}</p>
        )}
      </div>

      {tool.screenshotUrl && (
        <Link href={href} prefetch={false} className="group">
          <Image
            key={tool.screenshotUrl}
            src={tool.screenshotUrl}
            alt={`Screenshot of ${tool.name} website`}
            width={1280}
            height={1024}
            loading="lazy"
            className="aspect-video h-auto w-full rounded-md border object-cover object-top group-hover:brightness-95"
          />
        </Link>
      )}

      {tool.content && (
        <div className="relative max-h-72 overflow-hidden">
          <Markdown code={tool.content} />

          <div className="absolute inset-0 top-auto h-1/5 bg-linear-to-t from-background pointer-events-none" />
        </div>
      )}

      <Button suffix={<ArrowRightIcon />} className="self-start" asChild>
        <Link href={href} prefetch={false}>
          Read more
        </Link>
      </Button>
    </div>
  )
}

export { ToolEntry }
