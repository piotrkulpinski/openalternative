import { ArrowRightIcon } from "lucide-react"
import Image from "next/image"
import type { HTMLAttributes } from "react"
import { H2 } from "~/components/common/heading"
import { Link } from "~/components/common/link"
import { Stack } from "~/components/common/stack"
import { Markdown } from "~/components/web/markdown"
import { Button } from "~/components/common/button"
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
      <Stack
        size="lg"
        className="self-start before:content-['#'_counter(alternatives)] before:tabular-nums before:absolute before:right-full before:-mr-3 before:font-semibold before:text-3xl before:opacity-25 max-lg:before:hidden"
        asChild
      >
        <Link href={href} className="hover:underline">
          <FaviconImage src={tool.faviconUrl} title={tool.name} />

          <H2 className="leading-snug!">{tool.name}</H2>
        </Link>
      </Stack>

      {tool.description && (
        <p className="-mt-4 w-full text-secondary-foreground text-pretty md:text-lg md:-mt-6">
          {tool.description}
        </p>
      )}

      {tool.screenshotUrl && (
        <Link href={href} className="group">
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
        <Link href={href}>Read more</Link>
      </Button>
    </div>
  )
}

export { ToolEntry }
