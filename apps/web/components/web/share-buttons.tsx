"use client"

import { usePathname } from "next/navigation"
import type { ComponentProps, ReactNode } from "react"
import { Button } from "~/components/common/button"
import { H5 } from "~/components/common/heading"
import { Icon } from "~/components/common/icon"
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
    icon: <Icon name="tabler/brand-x" />,
  },
  {
    platform: "Bluesky",
    url: (url, title) => `https://bsky.app/intent/compose?text=${title}+${url}`,
    icon: <Icon name="tabler/brand-bluesky" />,
  },
  {
    platform: "Mastodon",
    url: (url, title) => `https://mastodon.social/share?text=${title}+${url}`,
    icon: <Icon name="tabler/brand-mastodon" />,
  },
  {
    platform: "Facebook",
    url: url => `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    icon: <Icon name="tabler/brand-facebook" />,
  },
  {
    platform: "LinkedIn",
    url: (url, title) => `https://linkedin.com/sharing/share-offsite?url=${url}&text=${title}`,
    icon: <Icon name="tabler/brand-linkedin" />,
  },
  {
    platform: "HackerNews",
    url: (url, title) => `https://news.ycombinator.com/submitlink?u=${url}&t=${title}`,
    icon: <Icon name="tabler/brand-ycombinator" />,
  },
  {
    platform: "Reddit",
    url: (url, title) => `https://reddit.com/submit?url=${url}&title=${title}`,
    icon: <Icon name="tabler/brand-reddit" />,
  },
  {
    platform: "WhatsApp",
    url: (url, title) => `https://api.whatsapp.com/send?text=${title}+${url}`,
    icon: <Icon name="tabler/brand-whatsapp" />,
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
