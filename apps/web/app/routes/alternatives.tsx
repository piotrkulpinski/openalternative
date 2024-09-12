import { Outlet } from "@remix-run/react"
import { BreadcrumbsLink } from "~/components/ui/breadcrumbs"

export const handle = {
  breadcrumb: () => <BreadcrumbsLink to="/alternatives" label="Alternatives" />,
}

export default function Alternatives() {
  return <Outlet />
}
