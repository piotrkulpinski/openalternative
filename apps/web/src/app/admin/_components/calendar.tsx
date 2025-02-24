"use client"

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { type ComponentProps, useState } from "react"
import { Button } from "~/components/common/button"
import { H5 } from "~/components/common/heading"
import { Link } from "~/components/common/link"
import { Stack } from "~/components/common/stack"
import type { findScheduledTools } from "~/server/admin/tools/queries"
import { cx } from "~/utils/cva"

type CalendarProps = ComponentProps<"div"> & {
  tools: Awaited<ReturnType<typeof findScheduledTools>>
}

export const Calendar = ({ className, tools, ...props }: CalendarProps) => {
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(today)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const isCurrentMonth =
    monthStart.getMonth() === today.getMonth() && monthStart.getFullYear() === today.getFullYear()

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const weeks = Array.from({ length: Math.ceil(days.length / 7) }, (_, i) =>
    days.slice(i * 7, (i + 1) * 7),
  )

  return (
    <div className={cx("space-y-4", className)} {...props}>
      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          size="sm"
          prefix={<ChevronLeftIcon />}
          onClick={() => setCurrentDate(date => subMonths(date, 1))}
          disabled={isCurrentMonth}
        />

        <H5>{format(currentDate, "MMMM yyyy")}</H5>

        <Button
          variant="secondary"
          size="sm"
          prefix={<ChevronRightIcon />}
          onClick={() => setCurrentDate(date => addMonths(date, 1))}
        />
      </div>

      <table className="w-full table-fixed border-collapse text-sm">
        <thead>
          <tr>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
              <th
                key={day}
                style={{ width: index < 5 ? "16%" : "10%" }}
                className="text-center text-muted-foreground py-2 text-xs font-normal border"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {weeks.map((week, weekIndex) => (
            <tr key={weekIndex}>
              {week.map((day, dayIndex) => (
                <td
                  key={`${weekIndex}-${dayIndex}`}
                  className={cx(
                    "h-16 p-2 border align-top",
                    format(day, "MMM") !== format(currentDate, "MMM") &&
                      "bg-muted text-muted-foreground/50",
                  )}
                >
                  <Stack size="xs" direction="column">
                    <div
                      className={cx(
                        "text-xs opacity-50",
                        isSameDay(day, today) && "text-primary opacity-100",
                      )}
                    >
                      {format(day, "d")}
                    </div>

                    {tools
                      .filter(tool => tool.publishedAt && isSameDay(tool.publishedAt, day))
                      .map(tool => (
                        <Link
                          key={tool.slug}
                          href={`/admin/tools/${tool.slug}`}
                          className="font-medium truncate hover:text-primary w-full"
                        >
                          {tool.name}
                        </Link>
                      ))}
                  </Stack>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
