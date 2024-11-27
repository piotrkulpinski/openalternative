import { Suspense } from "react"
import { AnalyticsCard, AnalyticsCardSkeleton } from "~/app/admin/_components/analytics-card"
import { ScheduledCard, ScheduledCardSkeleton } from "~/app/admin/_components/scheduled-card"
import { StatsCard } from "~/app/admin/_components/stats-card"
import { H3 } from "~/components/common/heading"

export default function DashboardPage() {
  return (
    <>
      <H3>Dashboard</H3>

      <div className="grid grid-cols-2 gap-4 overflow-clip md:grid-cols-3 lg:grid-cols-6">
        <StatsCard />

        <Suspense fallback={<AnalyticsCardSkeleton className="col-span-full lg:col-span-3" />}>
          <AnalyticsCard className="col-span-full lg:col-span-3" />
        </Suspense>

        <Suspense fallback={<ScheduledCardSkeleton className="col-span-full lg:col-span-3" />}>
          <ScheduledCard className="col-span-full lg:col-span-3" />
        </Suspense>
      </div>
    </>
  )
}
