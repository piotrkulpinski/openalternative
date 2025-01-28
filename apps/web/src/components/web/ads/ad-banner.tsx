import Image from "next/image"
import type { ComponentProps } from "react"
import { Box } from "~/components/common/box"
import { ExternalLink } from "~/components/web/external-link"
import { Badge } from "~/components/web/ui/badge"
import { Button } from "~/components/web/ui/button"
import { Container } from "~/components/web/ui/container"
import { findAd } from "~/server/web/ads/queries"
import { cx } from "~/utils/cva"

export const AdBanner = async ({ className, ...props }: ComponentProps<typeof Container>) => {
  const ad = await findAd({ where: { type: "Banner" } })

  if (!ad) {
    return null
  }

  return (
    <Box>
      <Container
        className={cx(
          "group/button relative -top-px inset-x-0 z-60 flex items-center justify-between gap-3 bg-card border-b py-2 hover:bg-card-dark lg:border-x lg:rounded-b-lg",
          className,
        )}
        asChild
        {...props}
      >
        <ExternalLink
          href={ad.website}
          eventName="click_ad"
          eventProps={{ url: ad.website, type: ad.type }}
        >
          <Badge variant="outline" className="max-sm:order-last">
            Ad
          </Badge>

          <div className="text-xs leading-tight text-secondary mr-auto md:text-sm">
            {ad.faviconUrl && (
              <Image
                src={ad.faviconUrl}
                alt={ad.name}
                width={32}
                height={32}
                className="inline-flex align-text-top mr-1 size-3.5 md:size-4"
              />
            )}
            <strong className="font-medium text-foreground">{ad.name}</strong> — {ad.description}
          </div>

          <Button
            variant="secondary"
            size="sm"
            className="shrink-0 pointer-events-none max-sm:hidden"
            asChild
          >
            <span>Learn More</span>
          </Button>
        </ExternalLink>
      </Container>
    </Box>
  )
}
