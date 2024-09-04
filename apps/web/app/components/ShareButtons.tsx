import { Link, useLocation } from "@remix-run/react"
import { Button } from "apps/web/app/components/Button"
import { H5 } from "apps/web/app/components/Heading"
import { Series } from "apps/web/app/components/Series"
import { Tooltip } from "apps/web/app/components/Tooltip"
import { BrandFacebookIcon } from "apps/web/app/components/icons/BrandFacebook"
import { BrandHackerNewsIcon } from "apps/web/app/components/icons/BrandHackerNews"
import { BrandLinkedInIcon } from "apps/web/app/components/icons/BrandLinkedIn"
import { BrandRedditIcon } from "apps/web/app/components/icons/BrandReddit"
import { BrandWhatsAppIcon } from "apps/web/app/components/icons/BrandWhatsApp"
import { BrandXIcon } from "apps/web/app/components/icons/BrandX"
import { SITE_NAME, SITE_URL } from "apps/web/app/utils/constants"
import { posthog } from "posthog-js"
import type { HTMLAttributes } from "react"

type ShareButtonsProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  title: string
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ title, ...props }) => {
  const { pathname, search } = useLocation()
  const currentUrl = `${SITE_URL}${pathname}${search}`

  const shareUrl = encodeURIComponent(currentUrl)
  const shareTitle = encodeURIComponent(`${title} — ${SITE_NAME}`)

  const shareOptions = [
    {
      platform: "X",
      url: `https://x.com/intent/post?text=${shareTitle}&url=${shareUrl}`,
      icon: <BrandXIcon />,
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
      url: `https://api.whatsapp.com/send?text=${`${shareTitle}+${shareUrl}`}`,
      icon: <BrandWhatsAppIcon />,
    },
  ]

  return (
    <Series {...props}>
      <H5 as="strong">Share:</H5>

      <Series className="gap-1">
        {shareOptions.map(({ platform, url, icon }) => (
          <Tooltip key={platform} tooltip={platform}>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => posthog.capture("share_clicked", { url, platform })}
              prefix={icon}
              isAffixOnly
              asChild
            >
              <Link to={url} target="_blank" rel="noopener noreferrer nofollow" />
            </Button>
          </Tooltip>
        ))}
      </Series>
    </Series>
  )
}
