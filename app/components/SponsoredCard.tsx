import { Link } from "@remix-run/react"
import { cx } from "~/utils/cva"
import { Button } from "./Button"
import { Card, type CardProps } from "./Card"
import { H4 } from "./Heading"
import { Logo } from "./Logo"

export const SponsoredCard = ({ className, ...props }: CardProps) => {
  return (
    <Card className={cx("order-2", className)} asChild {...props}>
      <Link to="/sponsor">
        <Card.Header>
          <H4 as="h2" className="truncate">
            Sponsor OpenAlternative
          </H4>
        </Card.Header>

        <Card.Description className="mb-auto line-clamp-4">
          Reach out to our audience of professional open source/tech enthusiasts to boost your
          sales.
        </Card.Description>

        <Button className="w-full pointer-events-none" asChild>
          <span>Become a sponsor</span>
        </Button>

        <Logo className="absolute -bottom-1/4 -right-1/4 size-64 opacity-[3.5%] rotate-45 pointer-events-none" />
      </Link>
    </Card>
  )
}
