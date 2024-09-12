"use client"

import type { PropsWithChildren } from "react"
import { TooltipProvider } from "~/components/ui/tooltip"

export function Providers({ children }: PropsWithChildren) {
  return <TooltipProvider delayDuration={250}>{children}</TooltipProvider>
}
