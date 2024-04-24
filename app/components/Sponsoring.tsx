import { useFetcher } from "@remix-run/react"
import { Button } from "~/components/Button"
import { DAY_IN_MS, SITE_NAME } from "~/utils/constants"
import { useEffect, useMemo, useState, HTMLAttributes } from "react"
import { Calendar } from "~/components/Calendar"
import { DateRange } from "react-day-picker"
import plur from "plur"
import { adjustSponsoringDuration, calculateSponsoringPrice } from "~/utils/sponsoring"
import { Badge } from "~/components/Badge"
import { cx } from "~/utils/cva"
import { action } from "~/routes/api.stripe.create-checkout"
import { z } from "zod"
import { stripeCheckoutSchema } from "~/services.server/stripe"

export const Sponsoring = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  const fetcher = useFetcher<typeof action>()
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

  useEffect(() => {
    if (fetcher.data?.type === "success" && fetcher.data.url) {
      window.location.href = fetcher.data.url
    }
  }, [fetcher.data])

  const onCreateCheckout = () => {
    if (!price || !date?.from || !date.to) return

    const payload: z.infer<typeof stripeCheckoutSchema> = {
      price: price.price,
      quantity: price.days,
      name: `${SITE_NAME} Sponsoring`,
      metadata: {
        startDate: date.from.getTime(),
        endDate: date.to.getTime() + DAY_IN_MS,
      },
    }

    fetcher.submit(payload, {
      method: "POST",
      encType: "application/json",
      action: "/api/stripe/create-checkout",
    })
  }

  return (
    <div className={cx("flex flex-col gap-4", className)} {...props}>
      <div className="flex flex-col border divide-y rounded-md">
        <Calendar
          mode="range"
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
          disabled={[(date) => date < new Date(), ...disabledDates]}
          className="p-4"
        />

        <div className="flex flex-col justify-between gap-4 text-sm text-muted text-center p-4 sm:flex-row sm:items-center sm:text-start">
          {price ? (
            <p>
              {price.days} {plur("day", price.days)} × ${price.price} ={" "}
              <strong className="font-medium text-foreground">${price.fullPrice}</strong>
              <Badge className="ml-3">{price.discountPercentage}% off</Badge>
            </p>
          ) : (
            <p>Please select a date range.</p>
          )}

          <Button
            variant="fancy"
            size="lg"
            disabled={!price}
            isPending={fetcher.state === "submitting"}
            className="-my-2"
            onClick={onCreateCheckout}
          >
            Purchase Now
          </Button>
        </div>

        {fetcher.data?.type === "error" && fetcher.data.error && (
          <div className="p-4 text-sm text-center text-red-500 sm:text-start">
            {fetcher.data.error}
          </div>
        )}
      </div>
    </div>
  )
}
