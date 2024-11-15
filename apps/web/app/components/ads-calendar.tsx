import type { Sponsoring, SponsoringType } from "@openalternative/db"
import type { SerializeFrom } from "@remix-run/node"
import { differenceInDays, endOfDay, startOfDay } from "date-fns"
import type { HTMLAttributes } from "react"
import { useCallback, useMemo } from "react"
import type { DateRange } from "react-day-picker"
import { Price } from "~/components/price"
import { Calendar } from "~/components/ui/calendar"
import { H4 } from "~/components/ui/heading"
import { Stack } from "~/components/ui/stack"
import type { AdsSelection, useAds } from "~/hooks/use-ads"
import { getFirstAvailableMonth } from "~/utils/ads"
import { cx } from "~/utils/cva"

export type AdsCalendar = {
  label: string
  type: SponsoringType
  description: string
  price: number
}

type AdsCalendarProps = HTMLAttributes<HTMLDivElement> & {
  calendar: AdsCalendar
  sponsorings: SerializeFrom<Sponsoring>[]
  price: ReturnType<typeof useAds>["price"]
  selections: AdsSelection[]
  updateSelection: (type: SponsoringType, selection: Partial<Omit<AdsSelection, "type">>) => void
}

export const AdsCalendar = ({
  className,
  calendar,
  sponsorings,
  price,
  selections,
  updateSelection,
  ...props
}: AdsCalendarProps) => {
  const selection = selections.find(s => s.type === calendar.type)

  const bookedDates = useMemo(
    () =>
      sponsorings
        .filter(({ type }) => type === calendar.type || type === "All")
        .map(({ startsAt, endsAt }) => ({
          from: startOfDay(new Date(startsAt)),
          to: startOfDay(new Date(endsAt)),
        })),
    [sponsorings, calendar.type],
  )

  const firstAvailableMonth = useMemo(() => getFirstAvailableMonth(bookedDates), [bookedDates])

  const calculateDuration = useCallback(
    (range: DateRange) => {
      if (!range.from || !range.to) return undefined

      const from = startOfDay(range.from)
      const to = endOfDay(range.to)

      const duration = differenceInDays(to, from) + 1
      const overlapDays = bookedDates.reduce((acc, { from: bookedFrom, to: bookedTo }) => {
        const normalizedBookedFrom = startOfDay(bookedFrom)
        const normalizedBookedTo = endOfDay(bookedTo)

        if (normalizedBookedTo < from || normalizedBookedFrom > to) return acc

        const overlapStart = from > normalizedBookedFrom ? from : normalizedBookedFrom
        const overlapEnd = to < normalizedBookedTo ? to : normalizedBookedTo
        const overlap = differenceInDays(overlapEnd, overlapStart) + 1

        return acc + overlap
      }, 0)

      return Math.max(duration - overlapDays, 0)
    },
    [bookedDates],
  )

  const handleSelect = useCallback(
    (newDateRange: DateRange | undefined) => {
      if (!newDateRange?.from || !newDateRange?.to) {
        updateSelection(calendar.type, {
          dateRange: newDateRange,
          duration: undefined,
        })
        return
      }

      const duration = calculateDuration(newDateRange)

      updateSelection(calendar.type, {
        dateRange: newDateRange,
        duration,
      })
    },
    [calendar.type, calculateDuration, updateSelection],
  )

  const discountedPrice = price?.discountPercentage
    ? calendar.price * (1 - price.discountPercentage / 100)
    : calendar.price

  return (
    <div className={cx("flex flex-col w-72 divide-y", className)} {...props}>
      <Stack className="justify-between py-2 px-4">
        <H4 as="h3" className="">
          {calendar.label}
        </H4>

        {price && <Price price={discountedPrice} interval="day" className="text-sm" />}

        <p className="w-full text-muted text-sm text-pretty">{calendar.description}</p>
      </Stack>

      <Calendar
        mode="range"
        selected={selection?.dateRange}
        onSelect={handleSelect}
        defaultMonth={firstAvailableMonth}
        disabled={[date => date < new Date(), ...bookedDates]}
        modifiers={{ booked: bookedDates }}
        modifiersClassNames={{ booked: "before:absolute before:inset-1 before:bg-cross" }}
        className="w-full p-4"
      />
    </div>
  )
}
