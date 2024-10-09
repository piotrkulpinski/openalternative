import { createServerActionProcedure } from "zsa"
import { auth } from "~/services/auth"

export const authedProcedure = createServerActionProcedure().handler(async () => {
  const session = await auth()

  if (!session?.user) {
    throw new Error("User not authenticated")
  }

  return { user: session.user }
})
