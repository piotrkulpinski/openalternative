import { NextResponse } from "next/server"
import { auth } from "~/services/auth"

export default auth(req => {
  const isAuthenticated = !!req.auth

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/signin", req.url))
  }

  return NextResponse.next()
})

// Don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|signin).*)"],
}
