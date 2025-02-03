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
    const callbackURL = new URL(nextUrl.pathname + nextUrl.search, nextUrl.origin)
    const signInUrl = new URL(`/login?callbackURL=${callbackURL.toString()}`, nextUrl.toString())

    return NextResponse.redirect(signInUrl)
  }

  if (!isAllowedEmail(session.user.email)) {
    await betterFetch<typeof auth.$Infer.Session>("/api/auth/sign-out", {
      method: "POST",
      baseURL: nextUrl.origin,
      headers: { cookie: headers.get("cookie") || "" },
    })

    return NextResponse.redirect(new URL("/", nextUrl.toString()))
  }

  return NextResponse.next()
}
