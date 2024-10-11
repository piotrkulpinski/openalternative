import { Link, useLocation } from "@remix-run/react"
import { posthog } from "posthog-js"
import type { HTMLAttributes } from "react"
import { Button } from "~/components/ui/button"
import { H5 } from "~/components/ui/heading"
import { BrandFacebookIcon } from "~/components/ui/icons/brand-facebook"
import { BrandHackerNewsIcon } from "~/components/ui/icons/brand-hackernews"
import { BrandLinkedInIcon } from "~/components/ui/icons/brand-linkedin"
import { BrandRedditIcon } from "~/components/ui/icons/brand-reddit"
import { BrandWhatsAppIcon } from "~/components/ui/icons/brand-whatsapp"
import { BrandXIcon } from "~/components/ui/icons/brand-x"
import { Stack } from "~/components/ui/stack"
import { Tooltip, TooltipProvider } from "~/components/ui/tooltip"
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
    <Stack {...props}>
      <H5 as="strong">Share:</H5>

      <Stack size="sm">
        <TooltipProvider delayDuration={500} disableHoverableContent>
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
        </TooltipProvider>
      </Stack>
    </Stack>
  )
}
