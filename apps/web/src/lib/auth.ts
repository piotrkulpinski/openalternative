import { db } from "@openalternative/db"
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { env } from "~/env"

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),

  socialProviders: {
    google: {
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    },

    github: {
      clientId: env.AUTH_GITHUB_ID,
      clientSecret: env.AUTH_GITHUB_SECRET,
      scope: ["read:user", "repo:public_repo"],
    },
  },
})
