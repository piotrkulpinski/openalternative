"use client"

import { usePathname } from "next/navigation"
import type { ComponentProps, ReactNode } from "react"
import { Button } from "~/components/common/button"
import { H5 } from "~/components/common/heading"
import { BrandBlueskyIcon } from "~/components/common/icons/brand-bluesky"
import { BrandFacebookIcon } from "~/components/common/icons/brand-facebook"
import { BrandHackerNewsIcon } from "~/components/common/icons/brand-hackernews"
import { BrandLinkedInIcon } from "~/components/common/icons/brand-linkedin"
import { BrandMastodonIcon } from "~/components/common/icons/brand-mastodon"
import { BrandRedditIcon } from "~/components/common/icons/brand-reddit"
import { BrandWhatsAppIcon } from "~/components/common/icons/brand-whatsapp"
import { BrandXIcon } from "~/components/common/icons/brand-x"
import { Stack } from "~/components/common/stack"
import { Tooltip } from "~/components/common/tooltip"
import { ExternalLink } from "~/components/web/external-link"
import { config } from "~/config"

type Platform =
  | "X"
  | "Bluesky"
  | "Mastodon"
  | "Facebook"
  | "LinkedIn"
  | "HackerNews"
  | "Reddit"
  | "WhatsApp"

type ShareOption = {
  platform: Platform
  url: (shareUrl: string, shareTitle: string) => string
  icon: ReactNode
}

const shareOptions: ShareOption[] = [
  {
    platform: "X",
    url: (url, title) => `https://x.com/intent/post?text=${title}&url=${url}`,
    icon: <BrandXIcon />,
  },
  {
    platform: "Bluesky",
    url: (url, title) => `https://bsky.app/intent/compose?text=${title}+${url}`,
    icon: <BrandBlueskyIcon />,
  },
  {
    platform: "Mastodon",
    url: (url, title) => `https://mastodon.social/share?text=${title}+${url}`,
    icon: <BrandMastodonIcon />,
  },
  {
    platform: "Facebook",
    url: url => `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    icon: <BrandFacebookIcon />,
  },
  {
    platform: "LinkedIn",
    url: (url, title) => `https://linkedin.com/sharing/share-offsite?url=${url}&text=${title}`,
    icon: <BrandLinkedInIcon />,
  },
  {
    platform: "HackerNews",
    url: (url, title) => `https://news.ycombinator.com/submitlink?u=${url}&t=${title}`,
    icon: <BrandHackerNewsIcon />,
  },
  {
    platform: "Reddit",
    url: (url, title) => `https://reddit.com/submit?url=${url}&title=${title}`,
    icon: <BrandRedditIcon />,
  },
  {
    platform: "WhatsApp",
    url: (url, title) => `https://api.whatsapp.com/send?text=${title}+${url}`,
    icon: <BrandWhatsAppIcon />,
  },
]

type ShareButtonsProps = Omit<ComponentProps<"div">, "title"> & {
  title: string
}

export const ShareButtons = ({ title, ...props }: ShareButtonsProps) => {
  const pathname = usePathname()

  const currentUrl = encodeURIComponent(`${config.site.url}${pathname}`)
  const shareTitle = encodeURIComponent(`${title} — ${config.site.name}`)

  return (
    <Stack {...props}>
      <H5 as="strong">Share:</H5>

      <Stack size="sm">
        {shareOptions.map(({ platform, url, icon }) => (
          <Tooltip key={platform} tooltip={platform}>
            <Button size="sm" variant="secondary" prefix={icon} asChild>
              <ExternalLink
                href={url(currentUrl, shareTitle)}
                eventName="click_share"
                eventProps={{ url: currentUrl, platform }}
              />
            </Button>
          </Tooltip>
        ))}
      </Stack>
    </Stack>
  )
}
