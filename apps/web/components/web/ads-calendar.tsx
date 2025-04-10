import type { AdType } from "@openalternative/db/client"
import { differenceInDays, endOfDay, startOfDay } from "date-fns"
import { type ComponentProps, useCallback, useMemo } from "react"
import type { DateRange } from "react-day-picker"
import { Button } from "~/components/common/button"
import { Calendar } from "~/components/common/calendar"
import { H4 } from "~/components/common/heading"
import { Stack } from "~/components/common/stack"
import { Tooltip } from "~/components/common/tooltip"
import { ExternalLink } from "~/components/web/external-link"
import { Price } from "~/components/web/price"
import type { AdSpot } from "~/config/ads"
import type { AdsSelection, useAds } from "~/hooks/use-ads"
import type { AdMany } from "~/server/web/ads/payloads"
import { getFirstAvailableMonth } from "~/utils/ads"
import { cx } from "~/utils/cva"
import { Icon } from "../common/icon"

type AdsCalendarProps = ComponentProps<"div"> & {
  adSpot: AdSpot
  ads: AdMany[]
  price: ReturnType<typeof useAds>["price"]
  selections: AdsSelection[]
  updateSelection: (type: AdType, selection: Partial<Omit<AdsSelection, "type">>) => void
}

export const AdsCalendar = ({
  className,
  adSpot,
  ads,
  price,
  selections,
  updateSelection,
  ...props
}: AdsCalendarProps) => {
  const selection = selections.find(s => s.type === adSpot.type)

  const booked = useMemo(
    () =>
      ads
        .filter(({ type }) => type === adSpot.type || type === "All")
        .map(({ startsAt, endsAt }) => ({
          from: startOfDay(startsAt),
          to: startOfDay(endsAt),
        })),
    [ads, adSpot.type],
  )

  const firstAvailableMonth = useMemo(() => getFirstAvailableMonth(booked), [booked])

  const calculateDuration = useCallback(
    (range: DateRange) => {
      if (!range.from || !range.to) return undefined

      const from = startOfDay(range.from)
      const to = endOfDay(range.to)

      const duration = differenceInDays(to, from) + 1
      const overlapDays = booked.reduce((acc, { from: bookedFrom, to: bookedTo }) => {
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
    [booked],
  )

  const handleSelect = useCallback(
    (dateRange?: DateRange) => {
      if (!dateRange?.from || !dateRange?.to) {
        updateSelection(adSpot.type, {
          dateRange,
          duration: undefined,
        })

        return
      }

      const duration = calculateDuration(dateRange)

      updateSelection(adSpot.type, { dateRange, duration })
    },
    [adSpot.type],
  )

  const discountedPrice = price?.discountPercentage
    ? adSpot.price * (1 - price.discountPercentage / 100)
    : adSpot.price

  return (
    <div className={cx("flex flex-col w-full divide-y", className)} {...props}>
      <Stack size="sm" direction="column" className="items-stretch py-2 px-4">
        <Stack>
          <H4 as="h3">{adSpot.label}</H4>

          {price && <Price price={discountedPrice} interval="day" className="ml-auto text-sm" />}
        </Stack>

        <Stack size="sm">
          {adSpot.preview && (
            <Tooltip tooltip="Preview this ad">
              <Button variant="secondary" size="sm" prefix={<Icon name="lucide/eye" />} asChild>
                <ExternalLink href={adSpot.preview} />
              </Button>
            </Tooltip>
          )}

          <p className="flex-1 text-muted-foreground text-sm text-pretty">{adSpot.description}</p>
        </Stack>
      </Stack>

      <Calendar
        mode="range"
        selected={selection?.dateRange}
        onSelect={handleSelect}
        startMonth={new Date(2024, 3)}
        defaultMonth={firstAvailableMonth}
        disabled={[date => date < new Date(), ...booked]}
        modifiers={{ booked }}
        modifiersClassNames={{ booked: "*:line-through" }}
        className="w-full p-4"
      />
    </div>
  )
}
