import type { SerializeFrom } from "@remix-run/node"
import { useFetcher } from "@remix-run/react"
import plur from "plur"
import { posthog } from "posthog-js"
import { type HTMLAttributes, useCallback, useEffect, useMemo, useState } from "react"
import type { DateRange } from "react-day-picker"
import { Badge } from "~/components/Badge"
import { Button } from "~/components/Button"
import { Calendar } from "~/components/Calendar"
import type { action } from "~/routes/api.stripe.create-checkout"
import type { StripeCheckoutSchema } from "~/services.server/stripe"
import { DAY_IN_MS } from "~/utils/constants"
import { cx } from "~/utils/cva"
import {
  adjustSponsoringDuration,
  calculateSponsoringPrice,
  getFirstAvailableMonth,
} from "~/utils/sponsoring"

type SponsoringProps = HTMLAttributes<HTMLDivElement> & {
  dates: SerializeFrom<{
    startsAt: Date
    endsAt: Date
  }>[]
}

export const Sponsoring = ({ className, dates, ...props }: SponsoringProps) => {
  const { data, state, submit } = useFetcher<typeof action>()
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [price, setPrice] = useState<ReturnType<typeof calculateSponsoringPrice> | undefined>()

  const disabledDates = useMemo(
    () =>
      dates.map(({ startsAt, endsAt }) => ({
        from: new Date(startsAt),
        to: new Date(Date.parse(endsAt) - DAY_IN_MS),
      })),
    [dates],
  )

  const firstAvailableMonth = useMemo(() => getFirstAvailableMonth(disabledDates), [disabledDates])

  useEffect(() => {
    if (!dateRange?.from || !dateRange?.to) {
      setPrice(undefined)
      return
    }

    const duration = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / DAY_IN_MS)
    const adjustedDuration = adjustSponsoringDuration(
      duration,
      dateRange.from,
      dateRange.to,
      disabledDates,
    )
    const newPrice = calculateSponsoringPrice(adjustedDuration + 1)

    setPrice(newPrice)
    posthog.capture("sponsoring_select", newPrice)
  }, [dateRange, disabledDates])

  useEffect(() => {
    if (data?.type === "success" && data.url) {
      window.location.href = data.url
    }
  }, [data])

  const onCreateCheckout = useCallback(() => {
    if (!price || !dateRange?.from || !dateRange.to) return

    const payload: StripeCheckoutSchema = {
      price: price.price,
      quantity: price.days,
      metadata: {
        startDate: dateRange.from.getTime(),
        endDate: dateRange.to.getTime() + DAY_IN_MS - 1000,
      },
    }

    submit(payload, {
      method: "POST",
      encType: "application/json",
      action: "/api/stripe/create-checkout",
    })

    posthog.capture("sponsoring_checkout", price)
  }, [price, dateRange, submit])

  return (
    <div className={cx("flex flex-col gap-4", className)} {...props}>
      <div className="flex flex-col border divide-y rounded-md">
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={setDateRange}
          numberOfMonths={2}
          defaultMonth={firstAvailableMonth}
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
