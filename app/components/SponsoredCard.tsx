import { Link } from "@remix-run/react"
import { Favicon } from "~/components/Favicon"
import type { SponsoringOne } from "~/services.server/api"
import { cx } from "~/utils/cva"
import { updateUrlWithSearchParams } from "~/utils/queryString"
import { Button } from "./Button"
import { Card, type CardProps } from "./Card"
import { H4 } from "./Heading"
import { Logo } from "./Logo"

type SponsoredCardProps = CardProps & {
  sponsoring: SponsoringOne | null
}

export const SponsoredCard = ({ className, sponsoring, ...props }: SponsoredCardProps) => {
  return (
    <Card className={cx("order-2", className)} asChild {...props}>
      <Link
        to={
          sponsoring?.website
            ? updateUrlWithSearchParams(sponsoring.website, { ref: "openalternative" })
            : "/sponsor"
        }
        target={sponsoring?.website ? "_blank" : "_self"}
        rel={sponsoring?.website ? "noopener noreferrer" : ""}
      >
        <Card.Header>
          <Favicon
            src={`https://www.google.com/s2/favicons?sz=128&domain_url=${sponsoring?.website}`}
          />

          <H4 as="h3" className="truncate">
            {sponsoring?.name || "Sponsor OpenAlternative"}
          </H4>
        </Card.Header>

        <Card.Description className="mb-auto line-clamp-4">
          {sponsoring?.description ||
            "Reach out to our audience of professional open source/tech enthusiasts to boost your sales."}
        </Card.Description>

        <Button className="w-full pointer-events-none" asChild>
          <span>{sponsoring ? `Visit ${sponsoring.name}` : "Become a sponsor"}</span>
        </Button>

        <Logo className="absolute -bottom-1/4 -right-1/4 size-64 opacity-[3.5%] rotate-45 pointer-events-none" />
      </Link>
    </Card>
  )
}
