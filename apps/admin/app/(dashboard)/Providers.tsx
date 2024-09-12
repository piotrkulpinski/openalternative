"use client"

import { TooltipProvider } from "~/components/ui/tooltip"

export function Providers({ children }: { children: React.ReactNode }) {
  return <TooltipProvider>{children}</TooltipProvider>
}
