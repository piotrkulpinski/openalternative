import type { PropsWithChildren } from "react"
import { Card } from "~/components/web/ui/card"

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <Card hover={false} focus={false} className="max-w-sm mx-auto bg-transparent md:p-8 md:pt-6">
      {children}
    </Card>
  )
}
