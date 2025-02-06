import { headers } from "next/headers"
import { redirect } from "next/navigation"
import type { PropsWithChildren } from "react"
import { Card } from "~/components/web/ui/card"
import { auth } from "~/lib/auth"

export default async function AuthLayout({ children }: PropsWithChildren) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (session?.user) {
    redirect("/")
  }

  return (
    <Card hover={false} focus={false} className="max-w-sm mx-auto bg-transparent md:p-8 md:pt-6">
      {children}
    </Card>
  )
}
