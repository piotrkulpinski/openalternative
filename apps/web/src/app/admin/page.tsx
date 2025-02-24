import { AnalyticsCard } from "~/app/admin/_components/analytics-card"
import { ScheduledCard } from "~/app/admin/_components/scheduled-card"
import { StatsCard } from "~/app/admin/_components/stats-card"
import { SubscribersCard } from "~/app/admin/_components/subscribers-card"
import { H3 } from "~/components/common/heading"

export default function DashboardPage() {
  return (
    <>
      <H3>Dashboard</H3>

      <div className="grid gap-4 items-start lg:grid-cols-5">
        <div className="grid gap-4 lg:col-span-3">
          <div className="grid gap-4 md:grid-cols-3">
            <StatsCard />
          </div>

          <ScheduledCard />
        </div>

        <div className="grid gap-4 lg:col-span-2">
          <AnalyticsCard />
          <SubscribersCard />
        </div>
      </div>
    </>
  )
}
