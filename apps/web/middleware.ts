import { type NextRequest, NextResponse } from "next/server"
import wretch from "wretch"
import type { auth } from "~/lib/auth"

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
}

export default async function ({ nextUrl, headers }: NextRequest) {
  const session = await wretch(`${nextUrl.origin}/api/auth/get-session`)
    .headers({ cookie: headers.get("cookie") || "" })
    .get()
    .json<typeof auth.$Infer.Session>()

  if (session && nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/", nextUrl.toString()))
  }

  if (nextUrl.pathname.startsWith("/admin")) {
    if (!session) {
      const callbackURL = nextUrl.pathname + nextUrl.search
      const signInUrl = new URL(`/auth/login?callbackURL=${callbackURL}`, nextUrl.toString())

      return NextResponse.redirect(signInUrl)
    }

    if (session.user.role !== "admin") {
      return NextResponse.redirect(new URL("/", nextUrl.toString()))
    }
  }

  return NextResponse.next()
}
