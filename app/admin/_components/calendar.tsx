"use client"

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns"
import { type ComponentProps, useState } from "react"
import { Button } from "~/components/common/button"
import { H5 } from "~/components/common/heading"
import { Icon } from "~/components/common/icon"
import { Link } from "~/components/common/link"
import { Stack } from "~/components/common/stack"
import type { findScheduledTools } from "~/server/admin/tools/queries"
import { cx } from "~/utils/cva"

type Tools = Awaited<ReturnType<typeof findScheduledTools>>

type CalendarDayProps = ComponentProps<"td"> & {
  day: Date
  currentDate: Date
  tools: Tools
}

const CalendarDay = ({ className, day, tools, currentDate, ...props }: CalendarDayProps) => {
  const isToday = isSameDay(day, new Date())
  const isCurrentMonth = isSameMonth(day, currentDate)
  const publishedTools = tools.filter(
    ({ publishedAt }) => publishedAt && isSameDay(publishedAt, day),
  )

  return (
    <td
      className={cx(
        "h-16 p-2 border align-top",
        !isCurrentMonth && "bg-muted text-muted-foreground/50",
        className,
      )}
      {...props}
    >
      <Stack size="xs" direction="column">
        <div
          className={cx(
            "text-xs",
            isToday ? "font-semibold text-primary opacity-100" : "opacity-50",
          )}
        >
          {format(day, "d")}
        </div>

        {publishedTools.map(tool => (
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
  )
}

type CalendarProps = ComponentProps<"div"> & {
  tools: Tools
}

export const Calendar = ({ className, tools, ...props }: CalendarProps) => {
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(today)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const weeks = Array.from({ length: Math.ceil(days.length / 7) }, (_, i) =>
    days.slice(i * 7, (i + 1) * 7),
  )

  return (
    <div className={cx("space-y-2", className)} {...props}>
      <Stack className="justify-between">
        <Button
          variant="secondary"
          size="sm"
          prefix={<Icon name="lucide/chevron-left" />}
          onClick={() => setCurrentDate(date => subMonths(date, 1))}
          disabled={isSameMonth(currentDate, today)}
        />

        <H5>{format(currentDate, "MMMM yyyy")}</H5>

        <Button
          variant="secondary"
          size="sm"
          prefix={<Icon name="lucide/chevron-right" />}
          onClick={() => setCurrentDate(date => addMonths(date, 1))}
        />
      </Stack>

      <table className="w-full table-fixed border-collapse text-sm">
        <thead>
          <tr>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
              <th
                key={day}
                style={{ width: index < 5 ? "16%" : "10%" }}
                className="text-start text-muted-foreground p-2 text-xs font-normal"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {weeks.map((week, weekIndex) => (
            <tr key={weekIndex}>
              {week.map(day => (
                <CalendarDay
                  key={day.toISOString()}
                  day={day}
                  tools={tools}
                  currentDate={currentDate}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
