"use client"

import { formatDate } from "@curiousleaf/utils"
import type { ComponentProps } from "react"
import { Bar, BarChart, Cell, Label, Rectangle, ReferenceLine, XAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "~/components/common/chart"
import { Skeleton } from "~/components/common/skeleton"
import { cx } from "~/utils/cva"

export type ChartData = {
  date: string
  value: number
}

type ChartProps = Partial<ComponentProps<typeof ChartContainer>> & {
  data: ChartData[]
  average?: number
  cellClassName?: string
}

export const Chart = ({ cellClassName, data, average, config, ...props }: ChartProps) => {
  if (data.length === 0) {
    return <Skeleton className="size-full" />
  }

  return (
    <ChartContainer config={{ ...config }} {...props}>
      <BarChart accessibilityLayer margin={{ left: -2, right: -2 }} data={data}>
        <Bar
          dataKey="value"
          radius={4}
          fillOpacity={0.75}
          activeBar={<Rectangle fillOpacity={1} />}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              className={cx(cellClassName, index === data.length - 1 && "opacity-50")}
            />
          ))}
        </Bar>

        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={4}
          tickFormatter={value => new Date(value).toLocaleDateString("en-US", { weekday: "short" })}
        />

        <ChartTooltip
          content={
            <ChartTooltipContent hideIndicator labelFormatter={value => formatDate(value)} />
          }
          cursor={false}
        />

        {average && (
          <ReferenceLine
            y={average}
            stroke="var(--color-muted-foreground)"
            strokeDasharray="3 3"
            strokeWidth={1}
          >
            <Label
              position="insideTopLeft"
              value={average.toLocaleString()}
              className="text-base drop-shadow-[1px_1px_0_var(--color-background)]"
              fill="var(--color-foreground)"
              offset={10}
              startOffset={100}
            />
          </ReferenceLine>
        )}
      </BarChart>
    </ChartContainer>
  )
}
