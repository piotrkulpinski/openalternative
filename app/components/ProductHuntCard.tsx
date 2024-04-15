import { posthog } from "posthog-js"
import { Link } from "@remix-run/react"
import { Card, CardProps } from "./Card"
import { Button } from "./Button"
import { H3 } from "./Heading"
import { cx } from "~/utils/cva"
import { PH_LAUNCHES } from "~/utils/constants"

type ProductHuntCardProps = CardProps & {
  launch?: (typeof PH_LAUNCHES)[0]
}

export const ProductHuntCard = ({ className, launch, ...props }: ProductHuntCardProps) => {
  if (!launch) return null

  return (
    <Card className={cx("max-lg:self-start items-center text-center", className)} {...props}>
      <H3 className="leading-tight">{launch.name} is live on Product Hunt 🥳</H3>

      <Card.Description className="my-auto line-clamp-4">
        Support{" "}
        <Link to={launch.slug} className="underline">
          {launch.name}
        </Link>{" "}
        on Product Hunt and help them get to the top of the charts.
      </Card.Description>

      <Button
        variant="secondary"
        className="w-full "
        prefix={<img src="/producthunt.svg" alt="" />}
        onClick={() => posthog.capture("ph_launch_clicked", { slug: launch.slug })}
        asChild
      >
        <a href={launch.url} target="_blank" rel="nofollow noreferrer">
          Support {launch.name}
        </a>
      </Button>

      <img
        src="/producthunt.svg"
        alt=""
        className="absolute -right-1/4 size-64 opacity-5 rotate-12 pointer-events-none"
      />
    </Card>
  )
}
