import { Outlet } from "@remix-run/react"
import { BreadcrumbsLink } from "~/components/ui/breadcrumbs"

export const handle = {
  breadcrumb: () => <BreadcrumbsLink to="/topics" label="Topics" />,
}

export default function Topics() {
  return <Outlet />
}
