"use client"

import { formatDate } from "@curiousleaf/utils"
import type { ComponentProps } from "react"
import { Bar, BarChart, Cell, Label, Rectangle, ReferenceLine, XAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "~/components/ui/chart"
import { Skeleton } from "~/components/ui/skeleton"

export type AnalyticsChartData = {
  date: string
  visitors: number
}

type AnalyticsChartProps = Partial<ComponentProps<typeof ChartContainer>> & {
  data: AnalyticsChartData[]
  average?: number
}

export const AnalyticsChart = ({ data, average, config, ...props }: AnalyticsChartProps) => {
  if (data.length === 0) {
    return <Skeleton className="size-full" />
  }

  return (
    <ChartContainer
      config={{
        visitors: {
          label: "Visitors",
        },
        ...config,
      }}
      {...props}
    >
      <BarChart accessibilityLayer margin={{ left: -2, right: -2 }} data={data}>
        <Bar
          dataKey="visitors"
          radius={4}
          fillOpacity={0.75}
          activeBar={<Rectangle fillOpacity={1} />}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={`hsl(var(--chart-4) / ${index === data.length - 1 ? "0.5" : "1"})`}
            />
          ))}
        </Bar>

        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={4}
          tickFormatter={value =>
            new Date(value).toLocaleDateString("en-US", {
              weekday: "short",
            })
          }
        />

        <ChartTooltip
          defaultIndex={2}
          content={
            <ChartTooltipContent hideIndicator labelFormatter={value => formatDate(value)} />
          }
          cursor={false}
        />

        {average && (
          <ReferenceLine
            y={average}
            stroke="hsl(var(--muted-foreground))"
            strokeDasharray="3 3"
            strokeWidth={1}
          >
            <Label
              position="insideTopLeft"
              value={average.toLocaleString()}
              className="text-lg"
              fill="hsl(var(--foreground))"
              offset={10}
              startOffset={100}
            />
          </ReferenceLine>
        )}
      </BarChart>
    </ChartContainer>
  )
}
