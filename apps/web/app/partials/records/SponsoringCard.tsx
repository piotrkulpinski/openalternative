import { Link } from "@remix-run/react"
import { Badge } from "apps/web/app/components/Badge"
import { Button } from "apps/web/app/components/Button"
import { Card, type CardProps } from "apps/web/app/components/Card"
import { Favicon } from "apps/web/app/components/Favicon"
import { H4 } from "apps/web/app/components/Heading"
import { Logo } from "apps/web/app/components/Logo"
import type { SponsoringOne } from "apps/web/app/services.server/api"
import { cx } from "apps/web/app/utils/cva"
import { updateUrlWithSearchParams } from "apps/web/app/utils/queryString"
import { ArrowUpRightIcon } from "lucide-react"
import { posthog } from "posthog-js"

type SponsoringCardProps = CardProps & {
  sponsoring: SponsoringOne | null
}

export const SponsoringCard = ({ className, sponsoring, ...props }: SponsoringCardProps) => {
  return (
    <Card className={cx("group/button", className)} asChild {...props}>
      <Link
        to={
          sponsoring?.website
            ? updateUrlWithSearchParams(sponsoring.website, { ref: "openalternative" })
            : "/sponsor"
        }
        target={sponsoring?.website ? "_blank" : "_self"}
        rel={sponsoring?.website ? "noopener noreferrer" : ""}
        onClick={() => posthog.capture("sponsoring_clicked", { url: sponsoring?.website })}
      >
        <Card.Header>
          {(sponsoring?.faviconUrl || sponsoring?.website) && (
            <Favicon
              src={
                sponsoring?.faviconUrl ||
                `https://www.google.com/s2/favicons?sz=128&domain_url=${sponsoring.website}`
              }
            />
          )}

          <H4 as="h3" className="truncate">
            {sponsoring?.name || "Sponsor OpenAlternative"}
          </H4>

          {sponsoring && (
            <Badge variant="outline" className="ml-auto">
              Ad
            </Badge>
          )}
        </Card.Header>

        <Card.Description className="mb-auto line-clamp-4">
          {sponsoring?.description ||
            "Reach out to our audience of professional open source/tech enthusiasts to boost your sales."}
        </Card.Description>

        <Button
          className="w-full pointer-events-none"
          suffix={sponsoring && <ArrowUpRightIcon />}
          asChild
        >
          <span>{sponsoring ? `Visit ${sponsoring.name}` : "Become a sponsor"}</span>
        </Button>

        {!sponsoring && (
          <Logo className="absolute -bottom-1/4 -right-1/4 -z-10 size-64 opacity-[3.5%] rotate-45 pointer-events-none transition group-hover/button:rotate-[60deg]" />
        )}
      </Link>
    </Card>
  )
}
