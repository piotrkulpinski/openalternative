import type { ComponentProps } from "react"
import { Card } from "~/components/common/card"
import { H5 } from "~/components/common/heading"
import { Icon } from "~/components/common/icon"
import { Note } from "~/components/common/note"
import { Stack } from "~/components/common/stack"
import { Tooltip } from "~/components/common/tooltip"
import { ExternalLink } from "~/components/web/external-link"
import { ToolHoverCard } from "~/components/web/tools/tool-hover-card"
import { Favicon } from "~/components/web/ui/favicon"
import { config } from "~/config"
import { siteConfig } from "~/config/site"
import { findTools } from "~/server/web/tools/queries"

export const FeaturedTools = async ({ ...props }: ComponentProps<typeof Card>) => {
  const tools = await findTools({ where: { isFeatured: true } })
  const showAddButton = tools.length < 12

  if (!tools.length) {
    return null
  }

  return (
    <Card hover={false} focus={false} {...props}>
      <Stack size="sm" direction="column">
        <H5 as="strong">Featured projects</H5>
        <Note>{siteConfig.name} is made possible by the following supporters:</Note>
      </Stack>

      <Stack className="gap-[7px]">
        {tools.map(tool => (
          <ToolHoverCard key={tool.slug} tool={tool}>
            <ExternalLink
              href={tool.affiliateUrl || tool.websiteUrl}
              doFollow={tool.isFeatured}
              eventName="click_website"
              eventProps={{
                url: tool.websiteUrl,
                isFeatured: tool.isFeatured,
                source: "supporter",
              }}
            >
              <Favicon src={tool.faviconUrl} title={tool.name} className="size-10 rounded-lg" />
            </ExternalLink>
          </ToolHoverCard>
        ))}

        {showAddButton && (
          <Tooltip tooltip="Contact us to get your project featured">
            <ExternalLink
              href={`mailto:${config.site.email}`}
              className="grid place-items-center size-10 p-1 rounded-lg border hover:bg-accent"
            >
              <Icon name="lucide/plus" className="size-6" />
            </ExternalLink>
          </Tooltip>
        )}
      </Stack>
    </Card>
  )
}
