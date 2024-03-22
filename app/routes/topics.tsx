import { Outlet } from "@remix-run/react"
import { BreadcrumbsLink } from "~/components/Breadcrumbs"

export const handle = {
  Breadcrumb: () => <BreadcrumbsLink to="/topics" label="Topics" />,
}

export default function Topics() {
  return <Outlet />
}
