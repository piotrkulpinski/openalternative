import { Link } from "@remix-run/react"
import { Button } from "./Button"
import { CardProps, Card } from "./Card"
import { H4 } from "./Heading"
import { cx } from "~/utils/cva"
import { Logo } from "./Logo"

export const SponsoredCard = ({ className, ...props }: CardProps) => {
  return (
    <Card
      className={cx(
        "!border-neutral-300 order-2 hover:bg-neutral-100 dark:!border-neutral-600 dark:hover:!bg-neutral-800",
        className
      )}
      asChild
      {...props}
    >
      <Link to="/sponsor">
        <Card.Header>
          <H4 as="h2" className="truncate">
            Sponsor OpenAlternative
          </H4>
        </Card.Header>

        <Card.Description className="mb-auto line-clamp-4 ">
          Reach out to our audience of professional developers and designers.
        </Card.Description>

        <Button className="w-full pointer-events-none" asChild>
          <span>Become a sponsor</span>
        </Button>

        <Logo className="absolute -bottom-1/4 -right-1/4 size-64 opacity-[3.5%] rotate-45 pointer-events-none" />
      </Link>
    </Card>
  )
}
