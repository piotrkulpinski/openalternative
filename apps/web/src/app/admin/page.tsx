import { AnalyticsCard } from "~/app/admin/_components/analytics-card"
import { ScheduledCard } from "~/app/admin/_components/scheduled-card"
import { StatsCard } from "~/app/admin/_components/stats-card"
import { SubscribersCard } from "~/app/admin/_components/subscribers-card"
import { H3 } from "~/components/common/heading"

export default function DashboardPage() {
  return (
    <>
      <H3>Dashboard</H3>

      <div className="grid grid-cols-2 gap-4 overflow-clip md:grid-cols-3 lg:grid-cols-6">
        <StatsCard />
        <AnalyticsCard className="col-span-full lg:col-span-3" />
        <SubscribersCard className="col-span-full lg:col-span-3" />
        <ScheduledCard className="col-span-full lg:col-span-3" />
      </div>
    </>
  )
}
