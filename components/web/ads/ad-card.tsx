import { isExternalUrl } from "@curiousleaf/utils"
import type { AdType, Prisma } from "@prisma/client"
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
  rel?: string
  type: AdType
  where?: Prisma.AdWhereInput
  fallbackAd?: Partial<AdOne>
}

const AdCard = async ({ className, type, where, fallbackAd, ...props }: AdCardProps) => {
  const defaultAd = { ...config.ads.defaultAd, ...fallbackAd }
  const ad = (await findAd({ where: { type, ...where } })) ?? defaultAd
  const isDefault = !isExternalUrl(ad.websiteUrl)

  return (
    <Card className={cx("group/button", className)} asChild {...props}>
      <ExternalLink
        href={ad.websiteUrl}
        target={isDefault ? "_self" : undefined}
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

        <CardDescription className="mb-auto line-clamp-4">{ad.description}</CardDescription>

        <Button
          className="pointer-events-none md:w-full"
          suffix={<Icon name="lucide/arrow-up-right" />}
          asChild
        >
          <span>{ad.buttonLabel ?? `Visit ${ad.name}`}</span>
        </Button>

        <CardIcon>
          {isDefault ? <LogoSymbol /> : <FaviconImage src={ad.faviconUrl} title={ad.name} />}
        </CardIcon>
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
        <Skeleton className="h-5 w-2/3">&nbsp;</Skeleton>
      </CardDescription>

      <Button className="pointer-events-none opacity-10 text-transparent md:w-full" asChild>
        <span>&nbsp;</span>
      </Button>
    </Card>
  )
}

export { AdCard, AdCardSkeleton }
