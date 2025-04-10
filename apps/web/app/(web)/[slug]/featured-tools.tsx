import type { ComponentProps } from "react"
import { Card } from "~/components/common/card"
import { H5 } from "~/components/common/heading"
import { Icon } from "~/components/common/icon"
import { Link } from "~/components/common/link"
import { Note } from "~/components/common/note"
import { Stack } from "~/components/common/stack"
import { ToolHoverCard } from "~/components/web/tools/tool-hover-card"
import { Favicon } from "~/components/web/ui/favicon"
import { siteConfig } from "~/config/site"
import { findTools } from "~/server/web/tools/queries"

export const FeaturedTools = async ({ ...props }: ComponentProps<typeof Card>) => {
  const tools = await findTools({ where: { isFeatured: true } })

  if (!tools.length) {
    return null
  }

  return (
    <Card hover={false} focus={false} {...props}>
      <Stack direction="column">
        <Stack size="sm">
          <Icon name="lucide/star" className="fill-current text-blue-500" />
          <H5 as="strong">Featured projects</H5>
        </Stack>

        <Note>{siteConfig.name} is made possible by the following supporters:</Note>
      </Stack>

      <Stack className="gap-2">
        {tools.map(tool => (
          <ToolHoverCard key={tool.slug} tool={tool}>
            <Link href={`/${tool.slug}`}>
              <Favicon src={tool.faviconUrl} title={tool.name} className="size-9" />
            </Link>
          </ToolHoverCard>
        ))}

        <Link
          href="/dashboard"
          className="grid place-items-center size-9 p-1 rounded-md border hover:bg-accent"
        >
          <Icon name="lucide/plus" />
        </Link>
      </Stack>
    </Card>
  )
}
