"use client"

import { formatDate, formatDateRange } from "@curiousleaf/utils"
import { parseISO } from "date-fns"
import { parseAsString, useQueryStates } from "nuqs"
import { type ComponentProps, useMemo } from "react"
import type { DateRange } from "react-day-picker"
import { Button, type ButtonProps } from "~/components/common/button"
import { Calendar } from "~/components/common/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/common/popover"
import { cx } from "~/utils/cva"
import { Icon } from "../common/icon"

type DateRangePickerProps = ComponentProps<typeof PopoverContent> & {
  /**
   * The selected date range.
   * @default undefined
   * @type DateRange
   * @example { from: new Date(), to: new Date() }
   */
  defaultDateRange?: DateRange

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

  /**
   * Controls whether query states are updated client-side only (default: true).
   * Setting to `false` triggers a network request to update the querystring.
   * @default true
   */
  shallow?: boolean
}

export function DateRangePicker({
  defaultDateRange,
  placeholder = "Pick a date",
  triggerVariant = "secondary",
  triggerSize = "md",
  triggerClassName,
  shallow = false,
  className,
  ...props
}: DateRangePickerProps) {
  const [dateParams, setDateParams] = useQueryStates(
    {
      from: parseAsString.withDefault(defaultDateRange?.from?.toISOString() ?? ""),
      to: parseAsString.withDefault(defaultDateRange?.to?.toISOString() ?? ""),
    },
    {
      clearOnDefault: true,
      shallow,
    },
  )

  const parseDate = (dateString: string | null) => {
    return dateString ? parseISO(dateString) : undefined
  }

  const date = useMemo(
    () => ({
      from: parseDate(dateParams.from) ?? defaultDateRange?.from,
      to: parseDate(dateParams.to) ?? defaultDateRange?.to,
    }),
    [dateParams, defaultDateRange],
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={triggerVariant}
          size={triggerSize}
          prefix={<Icon name="lucide/calendar" />}
          className={cx(
            "shrink-0 justify-start truncate text-left",
            !date && "text-muted-foreground",
            triggerClassName,
          )}
        >
          {date?.from ? (
            date.to ? (
              `${formatDateRange(date.from, date.to)}`
            ) : (
              `${formatDate(date.from)}`
            )
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className={cx("w-auto", className)} {...props}>
        <Calendar
          autoFocus
          mode="range"
          numberOfMonths={2}
          defaultMonth={date?.from}
          selected={date}
          onSelect={range => {
            void setDateParams({
              from: range?.from?.toISOString() ?? "",
              to: range?.to?.toISOString() ?? "",
            })
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
