import { Outlet } from "@remix-run/react"
import { BreadcrumbsLink } from "~/components/Breadcrumbs"

export const handle = {
  breadcrumb: () => <BreadcrumbsLink to="/blog" label="Blog" />,
}

export default function Blog() {
  return <Outlet />
}
