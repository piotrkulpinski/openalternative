"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import type { ComponentProps } from "react"
import { DayPicker } from "react-day-picker"
import { buttonVariants } from "~/components/admin/ui/button"
import { cx } from "~/utils/cva"

export const Calendar = ({ className, classNames, ...props }: ComponentProps<typeof DayPicker>) => {
  const buttonClasses = buttonVariants({
    variant: "outline",
    className: "text-xs p-1 pointer-events-auto",
  })

  return (
    <DayPicker
      className={cx("p-3", className)}
      classNames={{
        months: "relative flex flex-col sm:flex-row gap-y-4 sm:gap-x-4 sm:gap-y-0",
        month: "group/month space-y-4 w-full",
        month_caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "absolute top-0.5 inset-x-0 z-10 flex items-center justify-between gap-x-1 pointer-events-none",
        button_previous: buttonClasses,
        button_next: buttonClasses,
        month_grid: "w-full border-collapse gap-y-1",
        weekdays: "flex",
        weekday: "text-muted-foreground/50 rounded-md min-w-8 w-full font-normal text-xs",
        week: "group/week flex mt-2",
        day: "group/day relative w-full text-center text-[0.8125rem] rounded-md focus-within:z-20",
        day_button:
          "relative w-full px-1 py-[10%] cursor-pointer rounded-md hover:bg-muted hover:group-data-selected/day:bg-transparent",
        selected: "bg-foreground! text-background!",
        range_middle: "bg-muted! text-foreground! rounded-none",
        today:
          "font-semibold after:absolute after:inset-x-1/2 after:bottom-1.5 after:h-px after:w-4 after:-translate-x-1/2 after:rounded-[2px] after:bg-current",
        outside: "opacity-40",
        disabled: "opacity-40 pointer-events-none",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === "left") {
            return <ChevronLeftIcon className="size-4" />
          }
          return <ChevronRightIcon className="size-4" />
        },
      }}
      {...props}
    />
  )
}
