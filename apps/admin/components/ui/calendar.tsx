"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import type * as React from "react"
import { DayPicker } from "react-day-picker"
import { buttonVariants } from "~/components/ui/button"
import { cx } from "~/utils/cva"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cx("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-y-4 sm:gap-x-4 sm:gap-y-0",
        month: "space-y-4 w-full",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-x-1",
        nav_button: cx(
          buttonVariants({
            size: "sm",
            variant: "outline",
            className: "absolute text-xs p-1.5",
          }),
        ),
        nav_button_previous: "left-1",
        nav_button_next: "right-1",
        table: "w-full border-collapse gap-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md min-w-8 w-full font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cx(
          "relative py-0 px-0.5 min-w-8 w-full text-center text-sm focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md",
        ),
        day: cx(
          buttonVariants({
            size: "sm",
            variant: "ghost",
            className: "w-full p-1.5 font-normal aria-selected:opacity-100",
          }),
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-yellow-500/25 text-accent-foreground font-semibold",
        day_outside:
          "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeftIcon className="size-4" />,
        IconRight: () => <ChevronRightIcon className="size-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
