import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache"
import type { ComponentProps } from "react"
import { Chart } from "~/app/admin/_components/chart"
import { Card, CardDescription, CardHeader } from "~/components/common/card"
import { H2 } from "~/components/common/heading"
import { getTotalAnalytics } from "~/lib/analytics"

const getAnalytics = async () => {
  "use cache"

  cacheTag("analytics")
  cacheLife("minutes")

  return getTotalAnalytics()
}

const AnalyticsCard = async ({ ...props }: ComponentProps<typeof Card>) => {
  const { results, totalVisitors, averageVisitors } = await getAnalytics()

  return (
    <Card hover={false} focus={false} {...props}>
      <CardHeader>
        <CardDescription>Visitors</CardDescription>
        <span className="ml-auto text-xs text-muted-foreground">last 30 days</span>
        <H2 className="w-full">{totalVisitors.toLocaleString()}</H2>
      </CardHeader>

      <Chart
        data={results.map(({ date, visitors }) => ({ date, value: visitors }))}
        average={averageVisitors}
        className="w-full"
        cellClassName="bg-chart-4"
        label="Visitor"
      />
    </Card>
  )
}

export { AnalyticsCard }
