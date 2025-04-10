import { db } from "@openalternative/db"
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { admin, createAuthMiddleware, magicLink } from "better-auth/plugins"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { cache } from "react"
import { config } from "~/config"
import EmailLoginLink from "~/emails/login-link"
import { env } from "~/env"
import { sendEmails } from "~/lib/email"

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
    },
  },

  session: {
    cookieCache: {
      enabled: true,
    },
  },

  account: {
    accountLinking: {
      enabled: true,
    },
  },

  hooks: {
    after: createAuthMiddleware(async ({ path, context }) => {
      const callbackURL = context.responseHeaders?.get("location")

      if (callbackURL && path === "/callback/:id") {
        revalidatePath(callbackURL)
      }
    }),
  },

  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        const to = email
        const subject = `Your ${config.site.name} Login Link`

        await sendEmails({ to, subject, react: EmailLoginLink({ to, subject, url }) })
      },
    }),

    admin(),
  ],
})

export const getServerSession = cache(async () => {
  return auth.api.getSession({
    headers: await headers(),
  })
})
