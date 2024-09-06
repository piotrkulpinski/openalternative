"use client"

import { TooltipProvider } from "~/components/ui/Tooltip"

export default function Providers({ children }: { children: React.ReactNode }) {
  return <TooltipProvider>{children}</TooltipProvider>
}
