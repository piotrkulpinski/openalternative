import { Suspense } from "react"
import { H3 } from "~/components/ui/Heading"
import { AlternativesCard } from "./_components/AlternativesCard"
import { CardSkeleton } from "./_components/CardSkeleton"
import { CategoriesCard } from "./_components/CategoriesCard"
import { LicensesCard } from "./_components/LicensesCard"
import { ToolsCard } from "./_components/ToolsCard"

export default function DashboardPage() {
  return (
    <>
      <H3>Dashboard</H3>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardSkeleton />}>
          <ToolsCard />
        </Suspense>
        <Suspense fallback={<CardSkeleton />}>
          <AlternativesCard />
        </Suspense>
        <Suspense fallback={<CardSkeleton />}>
          <CategoriesCard />
        </Suspense>
        <Suspense fallback={<CardSkeleton />}>
          <LicensesCard />
        </Suspense>
      </div>
    </>
  )
}
