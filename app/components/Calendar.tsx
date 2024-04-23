import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { buttonVariants } from "./Button"
import { cx } from "~/utils/cva"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

export const Calendar = ({ classNames, ...props }: CalendarProps) => {
  return (
    <DayPicker
      classNames={{
        months: "flex flex-col sm:flex-row gap-8",
        month: "space-y-4 flex-1",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: buttonVariants({ size: "sm", variant: "secondary", className: "absolute" }),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "flex-1 text-muted rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cx(
          "relative flex-1 p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected]:enabled)]:bg-card-dark [&:has([aria-selected]:enabled.day-outside)]:bg-card-dark/50 [&:has([aria-selected]:enabled.day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: "h-8 w-full rounded-md p-0 font-normal hover:bg-card-dark",
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected: "bg-foreground text-background hover:bg-foreground hover:text-background",
        day_today: "bg-border",
        day_outside:
          "day-outside text-muted opacity-50 aria-selected:bg-card aria-selected:text-muted aria-selected:opacity-30",
        day_disabled: "text-muted opacity-50 pointer-events-none",
        day_range_middle: "aria-selected:bg-transparent aria-selected:[&:enabled]:text-current",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="size-4" />,
        IconRight: () => <ChevronRight className="size-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"
