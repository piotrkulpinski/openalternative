import { type NextRequest, NextResponse } from "next/server"
import wretch from "wretch"
import type { auth } from "~/lib/auth"

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/auth/:path*"],
}

export default async function ({ url, nextUrl, headers }: NextRequest) {
  const { pathname, search, origin } = nextUrl
  const homeUrl = new URL("/", url)
  const loginUrl = new URL(`/auth/login?next=${pathname}${search}`, url)

  const session = await wretch(`${origin}/api/auth/get-session`)
    .headers({ cookie: headers.get("cookie") || "" })
    .get()
    .json<typeof auth.$Infer.Session>()

  // If the user is logged in and tries to access the login page, redirect to the home page
  if (pathname.startsWith("/auth") && session) {
    return NextResponse.redirect(homeUrl)
  }

  // If the user is not logged in and tries to access the dashboard page, redirect to the login page
  if (pathname.startsWith("/dashboard") && !session) {
    return NextResponse.redirect(loginUrl)
  }

  // If the user tries to access the admin page
  if (pathname.startsWith("/admin")) {
    // If the user is not logged in, redirect to the login page
    if (!session) {
      return NextResponse.redirect(loginUrl)
    }

    // If the user is not an admin, redirect to the home page
    if (session && session.user.role !== "admin") {
      return NextResponse.redirect(homeUrl)
    }
  }

  return NextResponse.next()
}
