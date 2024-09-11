import { Slot } from "@radix-ui/react-slot"
import type { ReactNode } from "react"

type CardProps = {
  title: string
  value: string | number
  icon: ReactNode
  subtitle?: string
}

export const Card = ({ title, value, icon, subtitle }: CardProps) => (
  <div className="flex flex-col gap-2 p-6 rounded-xl border bg-card text-card-foreground">
    <div className="flex flex-row items-center justify-between gap-4">
      <h3 className="tracking-tight text-sm font-medium">{title}</h3>
      <Slot className="size-4 text-muted-foreground">{icon}</Slot>
    </div>

    <div className="flex flex-col">
      <div className="text-2xl font-bold">{value}</div>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  </div>
)
