import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { buttonVariants } from "~/components/ui/button"
import { cx } from "~/utils/cva"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

export const Calendar = ({ classNames, ...props }: CalendarProps) => {
  return (
    <DayPicker
      weekStartsOn={1}
      classNames={{
        months: "flex flex-col sm:flex-row gap-y-4 sm:gap-x-4 sm:gap-y-0",
        month: "space-y-4 w-full",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-x-1",
        nav_button: buttonVariants({
          variant: "ghost",
          className: "absolute text-xs p-1",
        }),
        nav_button_previous: "left-0",
        nav_button_next: "right-0",
        table: "w-full border-collapse gap-y-1",
        head_row: "flex",
        head_cell: "text-muted/50 rounded-md min-w-8 w-full font-normal text-xs",
        row: "flex mt-2",
        cell: cx(
          "relative min-w-8 w-full text-center text-sm focus-within:z-20 [&:has([aria-selected])]:bg-card-dark [&:has([aria-selected]:disabled)]:bg-card [&:has([aria-selected].day-outside)]:bg-card-dark/50",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md"
            : "[&:has([aria-selected])]:rounded-md",
        ),
        day: "relative w-full p-1.5 text-[0.8125rem]/none rounded-md hover:bg-card-dark",
        day_selected:
          "!bg-foreground/75 !text-background hover:bg-foreground/75 hover:text-background",
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_today: "!bg-primary/75 !text-background font-semibold",
        day_outside:
          "day-outside text-muted opacity-40 aria-selected:bg-card aria-selected:text-muted aria-selected:opacity-25",
        day_disabled: "text-muted opacity-40 pointer-events-none",
        day_range_middle: "aria-selected:!bg-transparent aria-selected:!text-current",
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
