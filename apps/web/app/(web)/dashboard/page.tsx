import type { SearchParams } from "nuqs/server"
import { DashboardToolListing } from "~/app/(web)/dashboard/listing"

export type DashboardPageProps = {
  searchParams: Promise<SearchParams>
}

export default function DashboardPage(props: DashboardPageProps) {
  return <DashboardToolListing {...props} />
}
