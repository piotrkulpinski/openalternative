import Image from "next/image"
import type { ComponentProps } from "react"
import { Badge } from "~/components/common/badge"
import { Box } from "~/components/common/box"
import { Button } from "~/components/common/button"
import { ExternalLink } from "~/components/web/external-link"
import { Container } from "~/components/web/ui/container"
import { findAd } from "~/server/web/ads/queries"
import { cx } from "~/utils/cva"

export const AdBanner = async ({ className, ...props }: ComponentProps<typeof Container>) => {
  const ad = await findAd({ where: { type: "Banner" } })

  if (!ad) {
    return null
  }

  return (
    <Box hover focus>
      <Container
        className={cx(
          "group/button relative -top-px z-50 flex items-center justify-between gap-3 pt-2 pb-2.5 bg-card hover:bg-accent lg:rounded-b-lg",
          "before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:border-4 before:border-t-0 before:border-background",
          className,
        )}
        asChild
        {...props}
      >
        <ExternalLink
          href={ad.websiteUrl}
          eventName="click_ad"
          eventProps={{ url: ad.websiteUrl, type: ad.type }}
        >
          <Badge variant="outline" className="leading-none max-sm:order-last">
            Ad
          </Badge>

          <div className="text-xs leading-tight text-secondary-foreground mr-auto md:text-sm">
            {ad.faviconUrl && (
              <Image
                src={ad.faviconUrl}
                alt={ad.name}
                width={32}
                height={32}
                className="flex float-left align-middle mr-1.5 size-3.5 rounded-sm md:size-4"
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
      </Container>
    </Box>
  )
}
