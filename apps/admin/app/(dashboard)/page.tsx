import { Suspense } from "react"
import { AnalyticsCard } from "~/app/(dashboard)/_components/analytics-card"
import { StatsCard } from "~/app/(dashboard)/_components/stats-card"
import { H3 } from "~/components/ui/heading"

export default function DashboardPage() {
  return (
    <>
      <H3>Dashboard</H3>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatsCard />

        <Suspense>
          <AnalyticsCard className="col-span-full" />
        </Suspense>
      </div>
    </>
  )
}
