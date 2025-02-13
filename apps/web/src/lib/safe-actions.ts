import { headers } from "next/headers"
import { createServerActionProcedure } from "zsa"
import { auth } from "~/lib/auth"
import { isAdminEmail } from "~/utils/auth"

export const adminProcedure = createServerActionProcedure().handler(async () => {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user || !isAdminEmail(session.user.email)) {
    throw new Error("User not authenticated")
  }

  return { user: session.user }
})
