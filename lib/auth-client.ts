import { adminClient, magicLinkClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
import { env } from "~/env"

export const { signIn, signOut, useSession, admin } = createAuthClient({
  baseURL: env.NEXT_PUBLIC_SITE_URL,
  plugins: [adminClient(), magicLinkClient()],
})
