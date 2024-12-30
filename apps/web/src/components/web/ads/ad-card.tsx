import type { AdType } from "@openalternative/db/client"
import { ArrowUpRightIcon } from "lucide-react"
import type { ComponentProps } from "react"
import { H4 } from "~/components/common/heading"
import { Skeleton } from "~/components/common/skeleton"
import { ExternalLink } from "~/components/web/external-link"
import { Badge } from "~/components/web/ui/badge"
import { Button } from "~/components/web/ui/button"
import {
  Card,
  CardBadges,
  CardDescription,
  CardHeader,
  type CardProps,
} from "~/components/web/ui/card"
import { Favicon } from "~/components/web/ui/favicon"
import { LogoSymbol } from "~/components/web/ui/logo-symbol"
import { config } from "~/config"
import { findAd } from "~/server/web/ads/queries"
import { cx } from "~/utils/cva"
import { updateUrlWithSearchParams } from "~/utils/queryString"

type AdCardProps = CardProps & {
  rel?: string
  type: AdType
}

const AdCard = async ({ className, type, ...props }: AdCardProps) => {
  const ad = (await findAd({ where: { type } })) ?? config.ads.defaultAd
  const isDefault = !ad.website.startsWith("http")

  return (
    <Card
      className={cx("group/button", isDefault && "overflow-clip", className)}
      asChild
      {...props}
    >
      <ExternalLink
        href={updateUrlWithSearchParams(ad.website, { ref: "openalternative" })}
        target={isDefault ? "_self" : undefined}
        rel={!isDefault ? "noopener noreferrer nofollow" : undefined}
        eventName="click_ad"
        eventProps={{ url: ad.website, type: ad.type }}
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

        <Button className="w-full pointer-events-none" suffix={<ArrowUpRightIcon />} asChild>
          <span>{isDefault ? "Advertise" : `Visit ${ad.name}`}</span>
        </Button>

        {isDefault && (
          <LogoSymbol className="absolute -bottom-2/5 -right-1/4 -z-10 size-64 opacity-[3.5%] rotate-45 pointer-events-none transition group-hover/button:rotate-[60deg]" />
        )}
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

      <Button className="w-full pointer-events-none" suffix={<ArrowUpRightIcon />} asChild>
        <span>&nbsp;</span>
      </Button>
    </Card>
  )
}

export { AdCard, AdCardSkeleton }
