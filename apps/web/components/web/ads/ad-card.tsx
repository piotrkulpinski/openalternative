import type { AdType } from "@openalternative/db/client"
import { Slot } from "radix-ui"
import type { ComponentProps } from "react"
import { Badge } from "~/components/common/badge"
import { Button } from "~/components/common/button"
import {
  Card,
  CardBadges,
  CardDescription,
  CardHeader,
  type CardProps,
} from "~/components/common/card"
import { H4 } from "~/components/common/heading"
import { Icon } from "~/components/common/icon"
import { Skeleton } from "~/components/common/skeleton"
import { ExternalLink } from "~/components/web/external-link"
import { Favicon, FaviconImage } from "~/components/web/ui/favicon"
import { LogoSymbol } from "~/components/web/ui/logo-symbol"
import { config } from "~/config"
import { findAd } from "~/server/web/ads/queries"
import { cx } from "~/utils/cva"

type AdCardProps = CardProps & {
  rel?: string
  type: AdType
}

const AdCard = async ({ className, type, ...props }: AdCardProps) => {
  const ad = (await findAd({ where: { type } })) ?? config.ads.defaultAd
  const isDefault = !ad.websiteUrl.startsWith("http")

  return (
    <Card className={cx("group/button", className)} asChild {...props}>
      <ExternalLink
        href={ad.websiteUrl}
        target={isDefault ? "_self" : undefined}
        eventName="click_ad"
        eventProps={{ url: ad.websiteUrl, type: ad.type }}
      >
        {!isDefault && (
          <CardBadges>
            <Badge variant="outline">Ad</Badge>
          </CardBadges>
        )}

        <CardHeader>
          <Favicon src={ad.faviconUrl} title={ad.name} />

          <H4 as="strong" className="truncate">
            {ad.name}
          </H4>
        </CardHeader>

        <CardDescription className="mb-auto line-clamp-4">{ad.description}</CardDescription>

        <Button
          className="w-full pointer-events-none"
          suffix={<Icon name="lucide/arrow-up-right" />}
          asChild
        >
          <span>{ad.buttonLabel ?? `Visit ${ad.name}`}</span>
        </Button>

        <div className="absolute inset-0 overflow-clip rounded-md">
          <Slot.Root className="absolute -top-2/5 -right-1/4 -z-10 size-60 opacity-5 rotate-12 pointer-events-none transition group-hover/button:rotate-[20deg]">
            {isDefault ? <LogoSymbol /> : <FaviconImage src={ad.faviconUrl} title={ad.name} />}
          </Slot.Root>
        </div>
      </ExternalLink>
    </Card>
  )
}

const AdCardSkeleton = ({ className }: ComponentProps<typeof Card>) => {
  return (
    <Card hover={false} className={cx("items-stretch select-none", className)}>
      <CardBadges>
        <Badge variant="outline">Ad</Badge>
      </CardBadges>

      <CardHeader>
        <Favicon src="/favicon.png" className="animate-pulse opacity-50" />

        <H4 className="w-2/3">
          <Skeleton>&nbsp;</Skeleton>
        </H4>
      </CardHeader>

      <CardDescription className="flex flex-col gap-0.5 mb-auto">
        <Skeleton className="h-5 w-full">&nbsp;</Skeleton>
        <Skeleton className="h-5 w-full">&nbsp;</Skeleton>
        <Skeleton className="h-5 w-2/3">&nbsp;</Skeleton>
      </CardDescription>

      <Button
        className="w-full pointer-events-none"
        suffix={<Icon name="lucide/arrow-up-right" />}
        asChild
      >
        <span>&nbsp;</span>
      </Button>
    </Card>
  )
}

export { AdCard, AdCardSkeleton }
