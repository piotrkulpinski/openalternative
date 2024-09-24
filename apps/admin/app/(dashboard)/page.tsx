import { Suspense } from "react"
import { AnalyticsCard, AnalyticsCardSkeleton } from "~/app/(dashboard)/_components/analytics-card"
import {
  ScheduledToolsCard,
  ScheduledToolsCardSkeleton,
} from "~/app/(dashboard)/_components/scheduled-tools-card"
import { StatsCard } from "~/app/(dashboard)/_components/stats-card"
import { Card, CardHeader } from "~/components/ui/card"
import { H3 } from "~/components/ui/heading"
import { Skeleton } from "~/components/ui/skeleton"

export default function DashboardPage() {
  return (
    <>
      <H3>Dashboard</H3>

      <div className="grid grid-cols-2 gap-4 overflow-clip md:grid-cols-3 lg:grid-cols-6">
        <Suspense
          fallback={Array.from({ length: 6 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-5 w-24" />
                <Skeleton className="text-3xl w-12">&nbsp;</Skeleton>
              </CardHeader>
            </Card>
          ))}
        >
          <StatsCard />
        </Suspense>

        <Suspense fallback={<AnalyticsCardSkeleton className="col-span-full lg:col-span-3" />}>
          <AnalyticsCard className="col-span-full lg:col-span-3" />
        </Suspense>

        <Suspense fallback={<ScheduledToolsCardSkeleton className="col-span-full lg:col-span-3" />}>
          <ScheduledToolsCard className="col-span-full lg:col-span-3" />
        </Suspense>
      </div>
    </>
  )
}
