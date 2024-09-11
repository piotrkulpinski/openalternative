import type { ComponentProps } from "react"
import {
  AnalyticsChart,
  type AnalyticsChartData,
} from "~/app/(dashboard)/_components/AnalyticsChart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/Card"
import { env } from "~/env"

export const AnalyticsCard = async ({ ...props }: ComponentProps<typeof Card>) => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_PLAUSIBLE_HOST}/api/v1/stats/timeseries?metrics=visitors&period=30d&site_id=${env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${env.PLAUSIBLE_API_KEY}` },
    },
  )

  const data = (await response.json()) as { results: AnalyticsChartData[] }
  const totalVisitors = data.results.reduce((acc, curr) => acc + curr.visitors, 0)
  const averageVisitors = Math.round(totalVisitors / data.results.length)

  return (
    <Card {...props}>
      <CardHeader>
        <CardDescription>Analytics</CardDescription>

        <CardTitle className="text-3xl tabular-nums">
          {totalVisitors.toLocaleString()}{" "}
          <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
            visitors
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <AnalyticsChart data={data.results} average={averageVisitors} className="h-56 w-full" />
      </CardContent>
    </Card>
  )
}
