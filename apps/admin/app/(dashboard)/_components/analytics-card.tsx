import type { ComponentProps } from "react"
import {
  AnalyticsChart,
  type AnalyticsChartData,
} from "~/app/(dashboard)/_components/analytics-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Skeleton } from "~/components/ui/skeleton"
import { env } from "~/env"

export const AnalyticsCard = async ({ ...props }: ComponentProps<typeof Card>) => {
  const response = await fetch(
    `${env.NEXT_PUBLIC_PLAUSIBLE_HOST}/api/v1/stats/timeseries?metrics=visitors&period=30d&site_id=${env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}`,
    {
      method: "GET",
      cache: "no-store",
      headers: { Authorization: `Bearer ${env.PLAUSIBLE_API_KEY}` },
    },
  )

  const data = (await response.json()) as { results: AnalyticsChartData[] }
  const totalVisitors = data.results.reduce((acc, curr) => acc + curr.visitors, 0)
  const averageVisitors = Math.round(totalVisitors / data.results.length)

  return (
    <Card {...props}>
      <CardHeader>
        <CardDescription>Visitors</CardDescription>
        <CardTitle className="text-3xl tabular-nums">{totalVisitors.toLocaleString()}</CardTitle>
      </CardHeader>

      <CardContent>
        <AnalyticsChart data={data.results} average={averageVisitors} className="h-56 w-full" />
      </CardContent>
    </Card>
  )
}

export const AnalyticsCardSkeleton = ({ ...props }: ComponentProps<typeof Card>) => {
  return (
    <Card {...props}>
      <CardHeader>
        <Skeleton className="h-5 w-12" />
        <Skeleton className="text-3xl w-24">&nbsp;</Skeleton>
      </CardHeader>

      <CardContent>
        <Skeleton className="h-56 w-full" />
      </CardContent>
    </Card>
  )
}
