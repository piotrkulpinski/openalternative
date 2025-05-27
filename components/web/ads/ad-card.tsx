import { isExternalUrl } from "@primoui/utils"
import type { Prisma } from "@prisma/client"
import type { ComponentProps } from "react"
import { Badge } from "~/components/common/badge"
import { Button } from "~/components/common/button"
import {
  Card,
  CardBadges,
  CardDescription,
  CardHeader,
  CardIcon,
  type CardProps,
} from "~/components/common/card"
import { H4 } from "~/components/common/heading"
import { Icon } from "~/components/common/icon"
import { Skeleton } from "~/components/common/skeleton"
import { ExternalLink } from "~/components/web/external-link"
import { Favicon, FaviconImage } from "~/components/web/ui/favicon"
import { LogoSymbol } from "~/components/web/ui/logo-symbol"
import { config } from "~/config"
import type { AdOne } from "~/server/web/ads/payloads"
import { findAd } from "~/server/web/ads/queries"
import { cx } from "~/utils/cva"

type AdCardProps = CardProps & {
  // Database query conditions to find a specific ad
  where?: Prisma.AdWhereInput
  // Override ad data without database query
  overrideAd?: AdOne | null
  // Default values to merge with the fallback ad
  defaultOverride?: Partial<AdOne>
}

const AdCard = async ({ className, where, overrideAd, defaultOverride, ...props }: AdCardProps) => {
  // Default ad values to display if no ad is found
  const defaultAd = { ...config.ads.defaultAd, ...defaultOverride }

  // Resolve the ad data from the override or database (don't query if override is defined)
  const resolvedAd = overrideAd !== undefined ? overrideAd : await findAd({ where })

  // Final ad data to display
  const ad = resolvedAd ?? defaultAd

  // Determine if the ad is internal or external
  const isInternalAd = !isExternalUrl(ad.websiteUrl)

  return (
    <Card className={cx("group/button", className)} asChild {...props}>
      <ExternalLink
        href={ad.websiteUrl}
        target={isInternalAd ? "_self" : undefined}
        eventName="click_ad"
        eventProps={{ url: ad.websiteUrl, type: ad.type, source: "card" }}
      >
        <CardBadges>
          <Badge variant="outline">Ad</Badge>
        </CardBadges>

        <CardHeader wrap={false}>
          <Favicon src={ad.faviconUrl ?? "/favicon.png"} title={ad.name} />

          <H4 as="strong" className="truncate">
            {ad.name}
          </H4>
        </CardHeader>

        <CardDescription className="mb-auto pr-2 line-clamp-4">{ad.description}</CardDescription>

        <Button
          className="pointer-events-none md:w-full"
          suffix={<Icon name="lucide/arrow-up-right" />}
          asChild
        >
          <span>{ad.buttonLabel || `Visit ${ad.name}`}</span>
        </Button>

        <CardIcon>
          {isInternalAd ? <LogoSymbol /> : <FaviconImage src={ad.faviconUrl} title={ad.name} />}
        </CardIcon>
      </ExternalLink>
    </Card>
  )
}

const AdCardSkeleton = ({ className, ...props }: ComponentProps<typeof Card>) => {
  return (
    <Card hover={false} className={cx("items-stretch select-none", className)} {...props}>
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
        <Skeleton className="h-5 w-2/3">&nbsp;</Skeleton>
      </CardDescription>

      <Button className="pointer-events-none opacity-10 text-transparent md:w-full" asChild>
        <span>&nbsp;</span>
      </Button>
    </Card>
  )
}

export { AdCard, AdCardSkeleton }
