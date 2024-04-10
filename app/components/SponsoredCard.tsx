import { Link } from "@remix-run/react"
import { Button } from "./Button"
import { CardProps, Card } from "./Card"
import { H3 } from "./Heading"
import { cx } from "~/utils/cva"
import { Favicon } from "./Favicon"

export const SponsoredCard = ({ className, ...props }: CardProps) => {
  return (
    <Card
      className={cx("!border-neutral-300 order-2 hover:bg-neutral-100", className)}
      asChild
      {...props}
    >
      <Link to="/sponsor">
        <Card.Header>
          <Favicon src="/favicon.svg" />
          <H3 className="truncate">Become a sponsor</H3>
        </Card.Header>

        <Card.Description className="my-auto line-clamp-4 ">
          Reach out to our audience of professional developers and designers.
        </Card.Description>

        <Button className="w-full pointer-events-none" asChild>
          <span>Learn more</span>
        </Button>
      </Link>
    </Card>
  )
}
