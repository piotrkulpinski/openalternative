import { ArrowUpRightIcon } from "lucide-react"
import Link from "next/link"
import { H4 } from "~/components/common/heading"
import { Badge } from "~/components/web/ui/badge"
import { Button } from "~/components/web/ui/button"
import { Card, type CardProps } from "~/components/web/ui/card"
import { Favicon } from "~/components/web/ui/favicon"
import { Logo } from "~/components/web/ui/logo"
import type { AdOne } from "~/server/ads/payloads"
import { cx } from "~/utils/cva"
import { updateUrlWithSearchParams } from "~/utils/queryString"

type AdCardProps = CardProps & {
  ad: AdOne | null
  rel?: string
}

export const AdCard = ({ className, ad: adProp, rel, ...props }: AdCardProps) => {
  // TODO: fix this
  const ad = adProp ?? ({ website: "/advertise" } as AdOne)
  const linkRel = rel ?? (ad.website ? "noopener noreferrer" : "")

  return (
    <Card
      className={cx("group/button", !ad.website && "overflow-clip", className)}
      isRevealed={false}
      asChild
      {...props}
    >
      <Link
        href={
          ad.website
            ? updateUrlWithSearchParams(ad.website, { ref: "openalternative" })
            : "/advertise"
        }
        target={ad.website ? "_blank" : "_self"}
        rel={linkRel}
        // onClick={() => posthog.capture("click_ad", { url: ad.website, type: ad.type })}
      >
        {ad.website && (
          <Card.Badges>
            <Badge variant="outline">Ad</Badge>
          </Card.Badges>
        )}

        <Card.Header>
          {(ad.faviconUrl || ad.website) && (
            <Favicon
              src={
                ad.faviconUrl ||
                `https://www.google.com/s2/favicons?sz=128&domain_url=${ad.website}`
              }
              title={ad.name}
            />
          )}

          <H4 as="strong" className="truncate">
            {ad.name || "Advertise with us"}
          </H4>
        </Card.Header>

        <Card.Description className="mb-auto line-clamp-4">
          {ad.description ||
            "Reach out to our audience of professional open source/tech enthusiasts to boost your sales."}
        </Card.Description>

        <Button className="w-full pointer-events-none" suffix={ad && <ArrowUpRightIcon />} asChild>
          <span>{ad ? `Visit ${ad.name}` : "Advertise with us"}</span>
        </Button>

        {!ad && (
          <Logo className="absolute -bottom-1/4 -right-1/4 -z-10 size-64 opacity-[3.5%] rotate-45 pointer-events-none transition group-hover/button:rotate-[60deg]" />
        )}
      </Link>
    </Card>
  )
}
