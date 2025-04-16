import Image from "next/image"
import type { ComponentProps } from "react"
import { Link } from "~/components/common/link"
import { ExternalLink } from "~/components/web/external-link"
import { ToolEntry as ToolEntryPrimitive } from "~/components/web/tools/tool-entry"
import { findTool } from "~/server/web/tools/queries"
import { cx } from "~/utils/cva"
import { Icon } from "../common/icon"

const a = ({ href, ...props }: ComponentProps<"a">) => {
  if (typeof href !== "string") {
    return <div {...(props as ComponentProps<"div">)} />
  }

  if (href.startsWith("/") || href.startsWith("#")) {
    return <Link href={href} {...props} />
  }

  return (
    <ExternalLink {...props} href={href}>
      {props.children}
      <Icon name="lucide/arrow-up-right" className="inline-block ml-0.5 mb-0.5 size-3.5" />
    </ExternalLink>
  )
}

const img = ({ className, ...props }: ComponentProps<"img">) => {
  if (typeof props.src !== "string" || typeof props.alt !== "string") {
    throw new TypeError("Image src and alt are required")
  }

  return (
    <Image
      src={props.src}
      alt={props.alt}
      width={1280}
      height={720}
      loading="lazy"
      className={cx("w-full rounded-lg", className)}
    />
  )
}

type ToolEntryProps = ComponentProps<typeof ToolEntryPrimitive> & {
  tool: string
  screenshotUrl: string | null
}

const ToolEntry = async ({ tool: toolSlug, screenshotUrl, ...props }: ToolEntryProps) => {
  "use server"

  const tool = await findTool({ where: { slug: toolSlug } })

  if (!tool) {
    return null
  }

  return <ToolEntryPrimitive id={tool.slug} tool={{ ...tool, screenshotUrl }} {...props} />
}

export const MDXComponents = { a, img, ToolEntry }
