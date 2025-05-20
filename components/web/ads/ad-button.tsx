import type { AdType } from "@prisma/client"
import type { ComponentProps } from "react"
import { Button } from "~/components/common/button"
import { Icon } from "~/components/common/icon"
import { Skeleton } from "~/components/common/skeleton"
import { ExternalLink } from "~/components/web/external-link"
import { FaviconImage } from "~/components/web/ui/favicon"
import { findAd } from "~/server/web/ads/queries"

type AdButtonProps = Omit<ComponentProps<typeof Button>, "type"> & {
  type: AdType
}

const AdButton = async ({ children, className, type, suffix, ...props }: AdButtonProps) => {
  const ad = await findAd({ where: { type } })

  if (!ad) return null

  const icon = ad.faviconUrl ? (
    <FaviconImage src={ad.faviconUrl} title={ad.name} className="size-4" />
  ) : (
    <Icon name="lucide/arrow-up-right" />
  )

  return (
    <Button variant="secondary" suffix={icon} asChild {...props}>
      <ExternalLink
        href={ad.websiteUrl}
        eventName="click_ad"
        eventProps={{ url: ad.websiteUrl, type: ad.type, source: "button" }}
      >
        {ad.buttonLabel ?? `Visit ${ad.name}`}
      </ExternalLink>
    </Button>
  )
}

const AdButtonSkeleton = ({ ...props }: ComponentProps<typeof Button>) => {
  return (
    <Button variant="secondary" {...props}>
      <Skeleton>&nbsp;</Skeleton>
    </Button>
  )
}

export { AdButton, AdButtonSkeleton }
