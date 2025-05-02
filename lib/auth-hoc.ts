import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "~/lib/auth"

type WithAuthHandler = (req: NextRequest, session: typeof auth.$Infer.Session) => Promise<Response>

/**
 * A higher order function that wraps a handler with authentication.
 * @param handler - The handler to wrap.
 * @returns A new handler that checks for authentication.
 */
export const withAuth = (handler: WithAuthHandler) => {
  return async (req: NextRequest) => {
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return handler(req, session)
  }
}

/**
 * A higher order function that wraps a handler with admin authentication.
 * @param handler - The handler to wrap.
 * @returns A new handler that checks for admin authentication.
 */
export const withAdminAuth = (handler: WithAuthHandler) => {
  return withAuth(async (req, session) => {
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return handler(req, session)
  })
}
