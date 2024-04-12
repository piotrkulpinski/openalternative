import { Card, CardProps } from "./Card"
import { PH_LAUNCHES } from "~/utils/constants"
import { Button } from "./Button"
import { H3 } from "./Heading"
import { Link } from "@remix-run/react"
import { cx } from "~/utils/cva"

export const ProductHuntCard = ({ className, ...props }: CardProps) => {
  const launches = PH_LAUNCHES.filter(({ date }) => {
    const currentTime = Date.now()
    const startTime = Date.parse(`${date} 07:00:00 GMT`)
    const endTime = startTime + 1000 * 60 * 60 * 24

    return currentTime >= startTime && currentTime <= endTime
  })

  if (!launches.length) {
    return null
  }

  const launch = launches[Math.floor(Math.random() * launches.length)]

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
