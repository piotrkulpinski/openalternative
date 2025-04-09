import { headers } from "next/headers"
import { redirect } from "next/navigation"
import type { FunctionComponent } from "react"
import { auth } from "~/lib/auth"

/**
 * A higher order function that wraps a page component with admin authentication.
 * @param Component - The page component to wrap.
 * @param redirectPath - Path to redirect to if not an admin (default: "/").
 * @returns A new component that checks for admin authentication.
 */
export const withAdminPage = (Component: FunctionComponent<any>, redirectPath = "/") => {
  return async function AdminProtectedPage(props: any) {
    const session = await auth.api.getSession({ headers: await headers() })

    if (session?.user.role !== "admin") {
      redirect(redirectPath)
    }

    return <Component {...props} />
  }
}
