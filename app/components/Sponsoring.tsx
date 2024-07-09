import type { SerializeFrom } from "@remix-run/node"
import { useFetcher } from "@remix-run/react"
import plur from "plur"
import { posthog } from "posthog-js"
import { type HTMLAttributes, useEffect, useState } from "react"
import type { DateRange } from "react-day-picker"
import { Badge } from "~/components/Badge"
import { Button } from "~/components/Button"
import { Calendar } from "~/components/Calendar"
import type { action } from "~/routes/api.stripe.create-checkout"
import type { StripeCheckoutSchema } from "~/services.server/stripe"
import { DAY_IN_MS, SITE_NAME } from "~/utils/constants"
import { cx } from "~/utils/cva"
import { adjustSponsoringDuration, calculateSponsoringPrice } from "~/utils/sponsoring"

type SponsoringProps = HTMLAttributes<HTMLDivElement> & {
  dates: SerializeFrom<{
    startsAt: Date
    endsAt: Date
  }>[]
}

export const Sponsoring = ({ className, dates, ...props }: SponsoringProps) => {
  const { data, state, submit } = useFetcher<typeof action>()
  const [date, setDate] = useState<DateRange>()
  const [price, setPrice] = useState<ReturnType<typeof calculateSponsoringPrice>>()

  const disabledDates = dates.map(({ startsAt, endsAt }) => ({
    from: new Date(Date.parse(startsAt)),
    to: new Date(Date.parse(endsAt) - DAY_IN_MS),
  }))

  // Calculate the duration in days
  useEffect(() => {
    if (!date?.from || !date?.to) {
      setPrice(undefined)
      return
    }

    const duration = Math.ceil((date.to.getTime() - date.from.getTime()) / DAY_IN_MS)
    const adjustedDuration = adjustSponsoringDuration(duration, date.from, date.to, disabledDates)
    const price = calculateSponsoringPrice(adjustedDuration + 1)

    // Set the price
    setPrice(price)

    // Send the event to PostHog
    posthog.capture("sponsoring_select", price)
  }, [date])

  useEffect(() => {
    if (data?.type === "success" && data.url) {
      window.location.href = data.url
    }
  }, [data])

  const onCreateCheckout = () => {
    if (!price || !date?.from || !date.to) return

    const payload: StripeCheckoutSchema = {
      price: price.price,
      quantity: price.days,
      name: `${SITE_NAME} Sponsoring`,
      metadata: {
        startDate: date.from.getTime(),
        endDate: date.to.getTime() + DAY_IN_MS,
      },
    }

    submit(payload, {
      method: "POST",
      encType: "application/json",
      action: "/api/stripe/create-checkout",
    })

    // Send the event to PostHog
    posthog.capture("sponsoring_checkout", price)
  }

  return (
    <div className={cx("flex flex-col gap-4", className)} {...props}>
      <div className="flex flex-col border divide-y rounded-md">
        <Calendar
          mode="range"
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
          disabled={[date => date < new Date(), ...disabledDates]}
          className="p-4"
        />

        <div className="flex flex-col justify-between gap-4 text-sm text-muted text-center p-4 sm:flex-row sm:items-center sm:text-start">
          {price ? (
            <p>
              {price.days} {plur("day", price.days)} × ${price.price} ={" "}
              <strong className="font-medium text-foreground">${price.fullPrice}</strong>
              {!!price.discountPercentage && (
                <Badge className="ml-3">{price.discountPercentage}% off</Badge>
              )}
            </p>
          ) : (
            <p>Please select a date range.</p>
          )}

          <Button
            variant="fancy"
            size="lg"
            disabled={!price}
            isPending={state === "submitting"}
            className="-my-2"
            onClick={onCreateCheckout}
          >
            Purchase Now
          </Button>
        </div>

        {data?.type === "error" && data.error && (
          <div className="p-4 text-sm text-center text-red-500 sm:text-start">{data.error}</div>
        )}
      </div>
    </div>
  )
}
