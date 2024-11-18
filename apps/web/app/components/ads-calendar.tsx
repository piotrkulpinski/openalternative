import type { Sponsoring, SponsoringType } from "@openalternative/db"
import type { SerializeFrom } from "@remix-run/node"
import { Link } from "@remix-run/react"
import { differenceInDays, endOfDay, startOfDay } from "date-fns"
import { EyeIcon } from "lucide-react"
import type { HTMLAttributes } from "react"
import { useCallback, useMemo } from "react"
import type { DateRange } from "react-day-picker"
import { Price } from "~/components/price"
import { Button } from "~/components/ui/button"
import { Calendar } from "~/components/ui/calendar"
import { H4 } from "~/components/ui/heading"
import { Stack } from "~/components/ui/stack"
import { Tooltip } from "~/components/ui/tooltip"
import type { AdsSelection, useAds } from "~/hooks/use-ads"
import { getFirstAvailableMonth } from "~/utils/ads"
import { cx } from "~/utils/cva"

export type AdsCalendar = {
  label: string
  type: SponsoringType
  description: string
  price: number
  preview?: string
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
    (dateRange?: DateRange) => {
      if (!dateRange?.from || !dateRange?.to) {
        updateSelection(calendar.type, {
          dateRange,
          duration: undefined,
        })

        return
      }

      const duration = calculateDuration(dateRange)

      updateSelection(calendar.type, { dateRange, duration })
    },
    [calendar.type],
  )

  const discountedPrice = price?.discountPercentage
    ? calendar.price * (1 - price.discountPercentage / 100)
    : calendar.price

  return (
    <div className={cx("flex flex-col w-full divide-y", className)} {...props}>
      <Stack size="sm" direction="column" className="items-stretch py-2 px-4">
        <Stack>
          <H4 as="h3">{calendar.label}</H4>

          {price && <Price price={discountedPrice} interval="day" className="ml-auto text-sm" />}
        </Stack>

        <Stack size="sm">
          {calendar.preview && (
            <Tooltip tooltip="Preview this ad">
              <Button variant="secondary" size="sm" prefix={<EyeIcon />} isAffixOnly asChild>
                <Link to={calendar.preview} target="_blank" rel="noopener noreferrer nofollow" />
              </Button>
            </Tooltip>
          )}

          <p className="flex-1 text-muted text-sm text-pretty">{calendar.description}</p>
        </Stack>
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
