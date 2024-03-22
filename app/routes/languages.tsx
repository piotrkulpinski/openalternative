import { BreadcrumbsLink } from "~/components/Breadcrumbs"
import { Outlet } from "@remix-run/react"

export const handle = {
  Breadcrumb: () => <BreadcrumbsLink to="/languages" label="Languages" />,
}

export default function Languages() {
  return <Outlet />
}
