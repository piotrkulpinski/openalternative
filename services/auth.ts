import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { env } from "~/env"
import { isAllowedEmail } from "~/utils/auth"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    }),
  ],

  callbacks: {
    signIn({ profile }) {
      return isAllowedEmail(profile?.email)
    },
  },

  pages: {
    signIn: "/signin",
  },
})
