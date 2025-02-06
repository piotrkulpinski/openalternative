import { db } from "@openalternative/db"
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { customSession, magicLink } from "better-auth/plugins"
import { config } from "~/config"
import EmailLoginLink from "~/emails/login-link"
import { env } from "~/env"
import { sendEmails } from "~/lib/email"
import { isAllowedEmail } from "~/utils/auth"

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

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },

  // rateLimit: {
  //   window: 10,
  //   max: 3,
  //   storage: "secondary-storage",
  // },

  // secondaryStorage: {
  //   get: async key => {
  //     const value = await redis.get<string | null>(key)
  //     return value ? value : null
  //   },

  //   set: async (key, value, ttl) => {
  //     if (ttl) {
  //       return await redis.set(key, value, { ex: ttl })
  //     }

  //     await redis.set(key, value)
  //   },

  //   delete: async key => {
  //     await redis.del(key)
  //   },
  // },

  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        const to = email
        const subject = `Your ${config.site.name} Login Link`

        await sendEmails({ to, subject, react: EmailLoginLink({ to, subject, url }) })
      },
    }),

    customSession(async ({ user, session }) => ({
      user: { ...user, isAdmin: isAllowedEmail(user.email) },
      session,
    })),
  ],
})
