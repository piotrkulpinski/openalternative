import { headers } from "next/headers"
import { createServerActionProcedure as createProcedure } from "zsa"
import { auth } from "~/lib/auth"

/**
 * A procedure that checks if the user is authenticated.
 */
export const userProcedure = createProcedure().handler(async () => {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    throw new Error("User not authenticated")
  }

  return { user: session.user }
})

/**
 * A procedure that checks if the user is an admin.
 */
export const adminProcedure = createProcedure(userProcedure).handler(async ({ ctx }) => {
  if (ctx.user.role !== "admin") {
    throw new Error("User not authenticated")
  }

  return { user: ctx.user }
})
