"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { posthog } from "posthog-js"
import type { ComponentProps } from "react"
import { H5 } from "~/components/common/heading"
import { BrandBlueskyIcon } from "~/components/common/icons/brand-bluesky"
import { BrandFacebookIcon } from "~/components/common/icons/brand-facebook"
import { BrandHackerNewsIcon } from "~/components/common/icons/brand-hackernews"
import { BrandLinkedInIcon } from "~/components/common/icons/brand-linkedin"
import { BrandRedditIcon } from "~/components/common/icons/brand-reddit"
import { BrandWhatsAppIcon } from "~/components/common/icons/brand-whatsapp"
import { BrandXIcon } from "~/components/common/icons/brand-x"
import { Stack } from "~/components/common/stack"
import { Button } from "~/components/web/ui/button"
import { Tooltip, TooltipProvider } from "~/components/web/ui/tooltip"
import { config } from "~/config"

type ShareButtonsProps = Omit<ComponentProps<"div">, "title"> & {
  title: string
}

export const ShareButtons = ({ title, ...props }: ShareButtonsProps) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentUrl = `${config.site.url}${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`

  const shareUrl = encodeURIComponent(currentUrl)
  const shareTitle = encodeURIComponent(`${title} — ${config.site.name}`)

  const shareOptions = [
    {
      platform: "X",
      url: `https://x.com/intent/post?text=${shareTitle}&url=${shareUrl}`,
      icon: <BrandXIcon />,
    },
    {
      platform: "Bluesky",
      url: `https://bsky.app/intent/compose?text=${shareTitle}+${shareUrl}`,
      icon: <BrandBlueskyIcon />,
    },
    {
      platform: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      icon: <BrandFacebookIcon />,
    },
    {
      platform: "LinkedIn",
      url: `https://linkedin.com/sharing/share-offsite?url=${shareUrl}&text=${shareTitle}`,
      icon: <BrandLinkedInIcon />,
    },
    {
      platform: "HackerNews",
      url: `https://news.ycombinator.com/submitlink?u=${shareUrl}&t=${shareTitle}`,
      icon: <BrandHackerNewsIcon />,
    },
    {
      platform: "Reddit",
      url: `https://reddit.com/submit?url=${shareUrl}&title=${shareTitle}`,
      icon: <BrandRedditIcon />,
    },
    {
      platform: "WhatsApp",
      url: `https://api.whatsapp.com/send?text=${shareTitle}+${shareUrl}`,
      icon: <BrandWhatsAppIcon />,
    },
  ]

  return (
    <Stack {...props}>
      <H5 as="strong">Share:</H5>

      <Stack size="sm">
        <TooltipProvider delayDuration={500} disableHoverableContent>
          {shareOptions.map(({ platform, url, icon }) => (
            <Tooltip key={platform} tooltip={platform}>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => posthog.capture("click_share", { url, platform })}
                prefix={icon}
                isAffixOnly
                asChild
              >
                <Link href={url} target="_blank" rel="noopener noreferrer nofollow" />
              </Button>
            </Tooltip>
          ))}
        </TooltipProvider>
      </Stack>
    </Stack>
  )
}
