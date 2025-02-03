import { createAuthClient } from "better-auth/react"
import { env } from "~/env"

export const { signIn, signOut, useSession } = createAuthClient({
  baseURL: `${env.NEXT_PUBLIC_SITE_URL}/api/auth`,
})
