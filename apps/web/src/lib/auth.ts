import { db } from "@openalternative/db"
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { customSession, magicLink } from "better-auth/plugins"
import { config } from "~/config"
import EmailLoginLink from "~/emails/login-link"
import { env } from "~/env"
import { sendEmails } from "~/lib/email"
import { isAdminEmail } from "~/utils/auth"

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

  account: {
    accountLinking: {
      enabled: true,
    },
  },

  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        const to = email
        const subject = `Your ${config.site.name} Login Link`

        await sendEmails({ to, subject, react: EmailLoginLink({ to, subject, url }) })
      },
    }),

    customSession(async ({ user, session }) => ({
      user: { ...user, isAdmin: isAdminEmail(user.email) },
      session,
    })),
  ],
})
