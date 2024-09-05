import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { env } from "~/env"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    }),
  ],

  callbacks: {
    signIn({ profile }) {
      return profile?.email?.endsWith("@kulpinski.pl") || false
    },
  },

  pages: {
    signIn: "/signin",
  },
})
