import { Outlet } from "@remix-run/react"
import { BreadcrumbsLink } from "~/components/Breadcrumbs"

export const handle = {
  Breadcrumb: () => <BreadcrumbsLink to="/alternatives" label="Alternatives" />,
}

export default function Alternatives() {
  return <Outlet />
}
