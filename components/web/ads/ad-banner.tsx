import Image from "next/image"
import type { ComponentProps } from "react"
import { Badge } from "~/components/common/badge"
import { Button } from "~/components/common/button"
import { Card } from "~/components/common/card"
import { ExternalLink } from "~/components/web/external-link"
import { Container } from "~/components/web/ui/container"
import { findAd } from "~/server/web/ads/queries"
import { cx } from "~/utils/cva"

export const AdBanner = async ({ className, ...props }: ComponentProps<typeof Card>) => {
  const ad = await findAd({ where: { type: "Banner" } })

  if (!ad) {
    return null
  }

  return (
    <Container asChild>
      <Card
        className={cx(
          "z-51 flex-row items-center gap-3 py-2.5 rounded-t-none border-t-0 max-lg:rounded-b-none",
          className,
        )}
        asChild
        {...props}
      >
        <ExternalLink
          href={ad.websiteUrl}
          eventName="click_ad"
          eventProps={{ url: ad.websiteUrl, type: ad.type, source: "banner" }}
        >
          <Badge variant="outline" className="leading-none max-sm:order-last">
            Ad
          </Badge>

          <div className="text-xs leading-tight text-secondary-foreground mr-auto sm:text-sm">
            {ad.faviconUrl && (
              <Image
                src={ad.faviconUrl}
                alt={ad.name}
                width={32}
                height={32}
                className="flex float-left align-middle mr-1.5 size-3.5 rounded-sm sm:size-4"
              />
            )}
            <strong className="font-medium text-foreground">{ad.name}</strong> — {ad.description}
          </div>

          <Button
            variant="secondary"
            size="sm"
            className="shrink-0 leading-none pointer-events-none max-sm:hidden"
            asChild
          >
            <span>{ad.buttonLabel ?? "Learn More"}</span>
          </Button>
        </ExternalLink>
      </Card>
    </Container>
  )
}
