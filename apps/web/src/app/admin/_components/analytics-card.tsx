import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache"
import type { ComponentProps } from "react"
import wretch from "wretch"
import { Chart } from "~/app/admin/_components/chart"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/admin/ui/card"
import { env } from "~/env"

type AnalyticsResponse = {
  results: { date: string; visitors: number }[]
}

const getAnalytics = async () => {
  "use cache"

  cacheTag("analytics")
  cacheLife("minutes")

  try {
    const domain = env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
    const host = env.PLAUSIBLE_API_URL
    const apiKey = env.PLAUSIBLE_API_KEY

    const queryOptions = new URLSearchParams({
      metrics: "visitors",
      period: "30d",
      site_id: domain,
    })

    const { results } = await wretch(`${host}/api/v1/stats/timeseries?${queryOptions.toString()}`)
      .auth(`Bearer ${apiKey}`)
      .get()
      .json<AnalyticsResponse>()

    const totalVisitors = results.reduce((acc, curr) => acc + curr.visitors, 0)
    const averageVisitors = Math.round(totalVisitors / results.length)

    return { results, totalVisitors, averageVisitors }
  } catch (error) {
    console.error("Analytics error:", error)
    return { results: [], totalVisitors: 0, averageVisitors: 0 }
  }
}

const AnalyticsCard = async ({ ...props }: ComponentProps<typeof Card>) => {
  const { results, totalVisitors, averageVisitors } = await getAnalytics()

  return (
    <Card {...props}>
      <CardHeader>
        <CardDescription>Visitors</CardDescription>
        <CardTitle className="text-3xl tabular-nums">{totalVisitors.toLocaleString()}</CardTitle>
      </CardHeader>

      <CardContent>
        <Chart
          data={results.map(({ date, visitors }) => ({ date, value: visitors }))}
          average={averageVisitors}
          className="h-56 w-full"
          cellClassName="fill-chart-4"
          config={{ value: { label: "Visitors" } }}
        />
      </CardContent>
    </Card>
  )
}

export { AnalyticsCard }
