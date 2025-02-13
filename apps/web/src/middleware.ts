import { betterFetch } from "better-auth/react"
import { type NextRequest, NextResponse } from "next/server"
import type { auth } from "~/lib/auth"
import { isAdminEmail } from "~/utils/auth"

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
}

export default async function ({ nextUrl, headers }: NextRequest) {
  const { data: session } = await betterFetch<typeof auth.$Infer.Session>("/api/auth/get-session", {
    baseURL: nextUrl.origin,
    headers: { cookie: headers.get("cookie") || "" },
  })

  if (session && nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/", nextUrl.toString()))
  }

  if (nextUrl.pathname.startsWith("/admin")) {
    if (!session) {
      const callbackURL = nextUrl.pathname + nextUrl.search
      const signInUrl = new URL(`/auth/login?callbackURL=${callbackURL}`, nextUrl.toString())

      return NextResponse.redirect(signInUrl)
    }

    if (!isAdminEmail(session.user.email)) {
      return NextResponse.redirect(new URL("/", nextUrl.toString()))
    }
  }

  return NextResponse.next()
}
