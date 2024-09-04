import { Outlet } from "@remix-run/react"
import { BreadcrumbsLink } from "apps/web/app/components/Breadcrumbs"

export const handle = {
  breadcrumb: () => <BreadcrumbsLink to="/languages" label="Languages" />,
}

export default function Languages() {
  return <Outlet />
}
