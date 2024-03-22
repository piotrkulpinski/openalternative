import { Outlet } from "@remix-run/react"
import { BreadcrumbsLink } from "~/components/Breadcrumbs"

export const handle = {
  breadcrumb: () => <BreadcrumbsLink to="/topics" label="Topics" />,
}

export default function Topics() {
  return <Outlet />
}
