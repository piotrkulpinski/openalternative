import { Outlet } from "@remix-run/react"
import { BreadcrumbsLink } from "~/components/Breadcrumbs"

export const handle = {
  breadcrumb: () => <BreadcrumbsLink to="/categories" label="Categories" />,
}

export default function Categories() {
  return <Outlet />
}
