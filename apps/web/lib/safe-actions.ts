import { headers } from "next/headers"
import { createServerActionProcedure } from "zsa"
import { auth } from "~/lib/auth"

export const adminProcedure = createServerActionProcedure().handler(async () => {
  const session = await auth.api.getSession({ headers: await headers() })

  if (session?.user.role !== "admin") {
    throw new Error("User not authenticated")
  }

  return { user: session.user }
})
