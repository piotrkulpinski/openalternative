import { AnalyticsCard } from "~/app/admin/_components/analytics-card"
import { ScheduledCard } from "~/app/admin/_components/scheduled-card"
import { StatsCard } from "~/app/admin/_components/stats-card"
import { SubscribersCard } from "~/app/admin/_components/subscribers-card"
import { UsersCard } from "~/app/admin/_components/users-card"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { H3 } from "~/components/common/heading"

const DashboardPage = () => {
  return (
    <>
      <H3>Dashboard</H3>

      <div className="grid gap-4 items-start lg:grid-cols-5">
        <div className="grid gap-4 lg:col-span-3">
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <StatsCard />
          </div>

          <ScheduledCard />
        </div>

        <div className="grid gap-4 lg:col-span-2">
          <AnalyticsCard />
          <SubscribersCard />
          <UsersCard />
        </div>
      </div>
    </>
  )
}

export default withAdminPage(DashboardPage)
