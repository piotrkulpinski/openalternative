import { betterAuth } from "better-auth"
import { env } from "~/env"

export const auth = betterAuth({
  socialProviders: {
    google: {
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    },
  },
})
