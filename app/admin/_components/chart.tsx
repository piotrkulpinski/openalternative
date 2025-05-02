"use client"

import { format } from "date-fns"
import plur from "plur"
import type { ComponentProps } from "react"
import { Note } from "~/components/common/note"
import { Stack } from "~/components/common/stack"
import { Tooltip } from "~/components/common/tooltip"
import { cx } from "~/utils/cva"

export type ChartData = {
  date: string
  value: number
}

type ChartProps = Partial<ComponentProps<"div">> & {
  data: ChartData[]
  average?: number
  cellClassName?: string
  label?: string
}

export const Chart = ({ className, cellClassName, data, average, label, ...props }: ChartProps) => {
  if (data.length === 0) {
    return <Note>No data available.</Note>
  }

  const maxValue = Math.max(...data.map(d => d.value), average || 0)

  return (
    <div className={cx("relative flex h-full min-h-24 w-full flex-col", className)} {...props}>
      {average !== undefined && (
        <div
          className="absolute inset-x-0 z-10 flex items-center pointer-events-none"
          style={{ bottom: `${(average / maxValue) * 100}%` }}
        >
          <div className="h-px w-full flex-1 border border-dashed border-foreground/15" />

          <Note className="absolute right-0 bottom-1 ">{Math.round(average).toLocaleString()}</Note>
        </div>
      )}

      <div className="flex items-end justify-between gap-1 size-full">
        {data.map((item, index) => (
          <Tooltip
            key={item.date}
            side="bottom"
            tooltip={
              <Stack size="sm" direction="column">
                <span className="opacity-60">
                  {format(new Date(item.date), "EEE, MMM d, yyyy")}
                </span>

                <span className="font-medium">
                  {item.value.toLocaleString()} {label && plur(label, item.value)}
                </span>
              </Stack>
            }
          >
            <div
              className={cx(
                "flex-1 bg-primary rounded-full transition-[height] duration-300 opacity-75 hover:opacity-100",
                index === data.length - 1 && "opacity-50",
                cellClassName,
              )}
              style={{ height: `${(item.value / maxValue) * 100}%` }}
            />
          </Tooltip>
        ))}
      </div>
    </div>
  )
}
