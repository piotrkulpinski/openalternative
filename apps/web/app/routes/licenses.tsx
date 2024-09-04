import { Outlet } from "@remix-run/react"
import { BreadcrumbsLink } from "apps/web/app/components/Breadcrumbs"

export const handle = {
  breadcrumb: () => <BreadcrumbsLink to="/licenses" label="Licenses" />,
}

export default function Licenses() {
  return <Outlet />
}
