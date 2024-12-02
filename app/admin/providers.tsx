"use client"

import type { PropsWithChildren } from "react"
import { TooltipProvider } from "~/components/admin/ui/tooltip"

type ProviderProps = PropsWithChildren

export function Providers({ children }: ProviderProps) {
  return <TooltipProvider delayDuration={250}>{children}</TooltipProvider>
}
