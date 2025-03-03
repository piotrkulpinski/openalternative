import { formatNumber } from "@curiousleaf/utils"
import { StarIcon } from "lucide-react"
import type { ComponentProps } from "react"
import { Card } from "~/components/common/card"
import { H5, H6 } from "~/components/common/heading"
import { Link } from "~/components/common/link"
import { Stack } from "~/components/common/stack"
import { FaviconImage } from "~/components/web/ui/favicon"
import { findTools } from "~/server/web/tools/queries"

export const FeaturedTools = async ({ ...props }: ComponentProps<typeof Card>) => {
  const tools = await findTools({ where: { isFeatured: true } })

  if (!tools.length) {
    return null
  }

  return (
    <Card hover={false} focus={false} {...props}>
      <H5 as="strong">Featured open source projects:</H5>

      <div className="w-full divide-y -my-1.5">
        {tools.map(tool => (
          <Stack key={tool.slug} size="sm" className="group py-1.5 justify-between w-full" asChild>
            <Link href={`/${tool.slug}`}>
              <Stack size="sm" wrap={false}>
                <FaviconImage src={tool.faviconUrl} title={tool.name} className="size-4" />

                <H6 as="strong" className="text-muted-foreground group-hover:text-foreground">
                  {tool.name}
                </H6>
              </Stack>

              <Stack size="xs">
                <StarIcon className="size-3" />
                <span className="text-xs text-muted-foreground tabular-nums">
                  {formatNumber(tool.stars, "standard")}
                </span>
              </Stack>
            </Link>
          </Stack>
        ))}
      </div>
    </Card>
  )
}
