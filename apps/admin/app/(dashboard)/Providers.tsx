"use client"

import { TooltipProvider } from "~/components/Tooltip"

export default function Providers({ children }: { children: React.ReactNode }) {
  return <TooltipProvider>{children}</TooltipProvider>
}
