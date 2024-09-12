import { Outlet } from "@remix-run/react"
import { BreadcrumbsLink } from "~/components/ui/breadcrumbs"

export const handle = {
  breadcrumb: () => <BreadcrumbsLink to="/licenses" label="Licenses" />,
}

export default function Licenses() {
  return <Outlet />
}
