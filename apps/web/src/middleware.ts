import { betterFetch } from "@better-fetch/fetch"
import { type NextRequest, NextResponse } from "next/server"
import type { auth } from "~/lib/auth"
import { isAllowedEmail } from "~/utils/auth"

export const config = {
  matcher: "/admin/:path*",
}

export default async function ({ nextUrl, headers }: NextRequest) {
  const { data: session } = await betterFetch<typeof auth.$Infer.Session>("/api/auth/get-session", {
    baseURL: nextUrl.origin,
    headers: { cookie: headers.get("cookie") || "" },
  })

  if (!session) {
    const callbackURL = nextUrl.pathname + nextUrl.search
    const signInUrl = new URL(`/login?callbackURL=${callbackURL}`, nextUrl.toString())

    return NextResponse.redirect(signInUrl)
  }

  if (!isAllowedEmail(session.user.email)) {
    return NextResponse.redirect(new URL("/", nextUrl.toString()))
  }

  return NextResponse.next()
}
