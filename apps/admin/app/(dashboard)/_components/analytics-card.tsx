import type { ComponentProps } from "react"
import wretch from "wretch"
import {
  AnalyticsChart,
  type AnalyticsChartData,
} from "~/app/(dashboard)/_components/analytics-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Skeleton } from "~/components/ui/skeleton"
import { env } from "~/env"

export const AnalyticsCard = async ({ ...props }: ComponentProps<typeof Card>) => {
  const api = wretch(`${env.NEXT_PUBLIC_PLAUSIBLE_HOST}/api/v1`)
    .errorType("json")
    .auth(`Bearer ${env.PLAUSIBLE_API_KEY}`)
    .options({ cache: "no-store" })
    .resolve(r => r.json<{ results: AnalyticsChartData[] }>())

  const options = {
    metrics: "visitors",
    period: "30d",
    site_id: env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
  }

  const { results } = await api.get(`/stats/timeseries?${new URLSearchParams(options).toString()}`)
  const totalVisitors = results.reduce((acc, curr) => acc + curr.visitors, 0)
  const averageVisitors = Math.round(totalVisitors / results.length)

  return (
    <Card {...props}>
      <CardHeader>
        <CardDescription>Visitors</CardDescription>
        <CardTitle className="text-3xl tabular-nums">{totalVisitors.toLocaleString()}</CardTitle>
      </CardHeader>

      <CardContent>
        <AnalyticsChart data={results} average={averageVisitors} className="h-56 w-full" />
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
