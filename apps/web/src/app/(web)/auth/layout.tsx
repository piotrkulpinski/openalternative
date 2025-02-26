import type { PropsWithChildren } from "react"
import { Card } from "~/components/common/card"

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <Card hover={false} focus={false} className="max-w-xs mx-auto">
      {children}
    </Card>
  )
}
