import type { PropsWithChildren } from "react"
import "./styles.css"
import { SessionProvider } from "next-auth/react"
import { auth } from "~/services/auth"

export const metadata = {
  title: "Next.js App Router + NextAuth + Tailwind CSS",
  description:
    "A user admin dashboard configured with Next.js, Postgres, NextAuth, Tailwind CSS, TypeScript, and Prettier.",
}

export default async function RootLayout({ children }: PropsWithChildren) {
  const session = await auth()

  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body className="flex min-h-screen w-full flex-col">{children}</body>
      </SessionProvider>
    </html>
  )
}
