import { NextResponse } from "next/server"
import { auth } from "~/lib/auth"

export const config = {
  matcher: "/admin/:path*",
}

export default auth(req => {
  const isAuthenticated = !!req.auth

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
})
