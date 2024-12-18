import { formatNumber } from "@curiousleaf/utils"
import { StarIcon } from "lucide-react"
import Link from "next/link"
import type { ComponentProps } from "react"
import { H5, H6 } from "~/components/common/heading"
import { Stack } from "~/components/common/stack"
import { Card } from "~/components/web/ui/card"
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
              <Stack size="sm" className="flex-nowrap">
                <FaviconImage src={tool.faviconUrl} title={tool.name} className="size-4" />

                <H6 as="strong" className="text-muted group-hover:text-foreground">
                  {tool.name}
                </H6>
              </Stack>

              <Stack size="xs">
                <StarIcon className="size-3" />
                <span className="text-xs text-muted tabular-nums">
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
