import { Intro } from "~/components/Intro"
import { MetaFunction, json } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { Button } from "~/components/Button"
import { DAY_IN_MS, SITE_NAME } from "~/utils/constants"
import { getMetaTags } from "~/utils/meta"
import { BarChart3Icon } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Calendar } from "~/components/Calendar"
import { DateRange } from "react-day-picker"
import plur from "plur"
import { adjustSponsoringDuration, calculateSponsoringPrice } from "~/utils/sponsoring"
import { Badge } from "~/components/Badge"

export const meta: MetaFunction<typeof loader> = ({ matches, data }) => {
  const { title, description } = data?.meta || {}

  return getMetaTags({
    title,
    description,
    parentMeta: matches.find(({ id }) => id === "root")?.meta,
  })
}

export const loader = () => {
  const meta = {
    title: "Supercharge your sales with sponsored listings",
    description: `Help us grow the list of open source alternatives to proprietary software. Contribute to ${SITE_NAME} by submitting a new open source alternative.`,
  }

  return json({ meta })
}

export default function SubmitPage() {
  const { meta } = useLoaderData<typeof loader>()
  const [date, setDate] = useState<DateRange>()
  const [price, setPrice] = useState<ReturnType<typeof calculateSponsoringPrice>>()
  const disabledDates: DateRange[] = useMemo(
    () => [{ from: new Date(2024, 4, 18), to: new Date(2024, 4, 29) }],
    []
  )

  // Calculate the duration in days
  useEffect(() => {
    if (!date?.from || !date?.to) {
      setPrice(undefined)
      return
    }

    const duration = Math.ceil((date.to.getTime() - date.from.getTime()) / DAY_IN_MS)
    const adjustedDuration = adjustSponsoringDuration(duration, date.from, date.to, disabledDates)
    const price = calculateSponsoringPrice(adjustedDuration + 1)

    setPrice(price)
  }, [date, disabledDates])

  return (
    <>
      <Intro {...meta}>
        <Button variant="secondary" prefix={<BarChart3Icon />} className="mt-3" asChild>
          <a
            href="https://go.openalternative.co/analytics"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Analytics
          </a>
        </Button>
      </Intro>

      <div className="flex flex-col gap-4 max-w-2xl">
        <div className="flex flex-col border rounded-md">
          <Calendar
            mode="range"
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            disabled={[(date) => date < new Date(), ...disabledDates]}
            className="p-4"
          />

          <div className="flex flex-col justify-between gap-4 text-sm text-muted text-center border-t p-4 sm:flex-row sm:items-center sm:text-start">
            {price ? (
              <p>
                {price.days} {plur("day", price.days)} × ${price.price} ={" "}
                <strong className="font-medium text-foreground">${price.fullPrice}</strong>
                <Badge className="ml-3">{price.discountPercentage}% off</Badge>
              </p>
            ) : (
              <p>Please select a date range.</p>
            )}

            <Button variant="fancy" size="lg" disabled={!price}>
              Purchase Now
            </Button>
          </div>
        </div>
      </div>

      {/* <div className="grid-auto-fill-xs grid gap-4">
        <Card>
          <H1 as="h3">500+</H1>
          <Card.Description>Visitors Per/Day</Card.Description>
        </Card>
        <Card>
          <H1 as="h3">$1000+</H1>
          <Card.Description>Affiliate Sales Per/Month</Card.Description>
        </Card>
        <Card>
          <H1 as="h3">175+</H1>
          <Card.Description>Open Source Listings</Card.Description>
        </Card>
      </div> */}
    </>
  )
}
