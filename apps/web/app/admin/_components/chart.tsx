"use client"

import { format } from "date-fns"
import plur from "plur"
import type { ComponentProps } from "react"
import { Stack } from "~/components/common/stack"
import { Tooltip, TooltipProvider } from "~/components/common/tooltip"
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
    return <p className="text-sm text-muted-foreground">No data available.</p>
  }

  const maxValue = Math.max(...data.map(d => d.value), average || 0)

  return (
    <TooltipProvider delayDuration={250}>
      <div className={cx("relative flex h-full min-h-48 w-full flex-col", className)} {...props}>
        {average !== undefined && (
          <div
            className="absolute inset-x-0 z-10 flex items-center"
            style={{ bottom: `${(average / maxValue) * 100}%` }}
          >
            <div className="h-px w-full flex-1 border border-dashed border-foreground/15" />

            <span className="absolute right-0 bottom-1 text-sm text-muted-foreground tabular-nums">
              {Math.round(average).toLocaleString()}
            </span>
          </div>
        )}

        <div className="flex items-end justify-between gap-0.5 size-full">
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
    </TooltipProvider>
  )
}
