import { Link, useLocation } from "@remix-run/react"
import { posthog } from "posthog-js"
import type { HTMLAttributes } from "react"
import { Button } from "~/components/Button"
import { H5 } from "~/components/Heading"
import { Series } from "~/components/Series"
import { Tooltip } from "~/components/Tooltip"
import { BrandFacebookIcon } from "~/components/icons/BrandFacebook"
import { BrandHackerNewsIcon } from "~/components/icons/BrandHackerNews"
import { BrandLinkedInIcon } from "~/components/icons/BrandLinkedIn"
import { BrandRedditIcon } from "~/components/icons/BrandReddit"
import { BrandWhatsAppIcon } from "~/components/icons/BrandWhatsApp"
import { BrandXIcon } from "~/components/icons/BrandX"
import { SITE_NAME, SITE_URL } from "~/utils/constants"

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
