"use client"

import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import * as React from "react"
import type { DateRange } from "react-day-picker"
import { Button, type ButtonProps } from "~/components/ui/button"
import { Calendar } from "~/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { cx } from "~/utils/cva"

interface DateRangePickerProps extends React.ComponentPropsWithoutRef<typeof PopoverContent> {
  /**
   * The selected date range.
   * @default undefined
   * @type DateRange
   * @example { from: new Date(), to: new Date() }
   */
  dateRange?: DateRange

  /**
   * The number of days to display in the date range picker.
   * @default undefined
   * @type number
   * @example 7
   */
  dayCount?: number

  /**
   * The placeholder text of the calendar trigger button.
   * @default "Pick a date"
   * @type string | undefined
   */
  placeholder?: string

  /**
   * The variant of the calendar trigger button.
   * @default "outline"
   * @type "default" | "outline" | "secondary" | "ghost"
   */
  triggerVariant?: Exclude<ButtonProps["variant"], "destructive" | "link">

  /**
   * The size of the calendar trigger button.
   * @default "default"
   * @type "default" | "sm" | "lg"
   */
  triggerSize?: ButtonProps["size"]

  /**
   * The class name of the calendar trigger button.
   * @default undefined
   * @type string
   */
  triggerClassName?: string
}

export function DateRangePicker({
  dateRange,
  dayCount,
  placeholder = "Pick a date",
  triggerVariant = "outline",
  triggerSize = "md",
  triggerClassName,
  className,
  ...props
}: DateRangePickerProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [date, setDate] = React.useState<DateRange | undefined>(() => {
    const fromParam = searchParams.get("from")
    const toParam = searchParams.get("to")

    let fromDay: Date | undefined
    let toDay: Date | undefined

    if (dateRange) {
      fromDay = dateRange.from
      toDay = dateRange.to
    } else if (dayCount) {
      toDay = new Date()
      fromDay = addDays(toDay, -dayCount)
    }

    return {
      from: fromParam ? new Date(fromParam) : fromDay,
      to: toParam ? new Date(toParam) : toDay,
    }
  })

  // Update query string
  React.useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams)
    if (date?.from) {
      newSearchParams.set("from", format(date.from, "yyyy-MM-dd"))
    } else {
      newSearchParams.delete("from")
    }

    if (date?.to) {
      newSearchParams.set("to", format(date.to, "yyyy-MM-dd"))
    } else {
      newSearchParams.delete("to")
    }

    router.replace(`${pathname}?${newSearchParams.toString()}`, {
      scroll: false,
    })
  }, [date?.from, date?.to])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={triggerVariant}
          size={triggerSize}
          prefix={<CalendarIcon />}
          className={cx(
            "shrink-0 justify-start truncate text-left",
            !date && "text-muted-foreground",
            triggerClassName,
          )}
        >
          {date?.from ? (
            date.to ? (
              `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}`
            ) : (
              `${format(date.from, "LLL dd, y")}`
            )
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className={cx("w-auto p-0", className)} {...props}>
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  )
}
