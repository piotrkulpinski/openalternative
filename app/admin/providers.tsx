"use client"

import { type PropsWithChildren, use } from "react"
import { TooltipProvider } from "~/components/admin/ui/tooltip"
import { StatsContext } from "~/hooks/use-stats-context"

type ProviderProps = PropsWithChildren<{
  statsPromise: Promise<[number, number, number, number, number, number]>
}>

export function Providers({ children, statsPromise }: ProviderProps) {
  const stats = use(statsPromise)

  return (
    <StatsContext.Provider value={stats}>
      <TooltipProvider delayDuration={250}>{children}</TooltipProvider>
    </StatsContext.Provider>
  )
}
