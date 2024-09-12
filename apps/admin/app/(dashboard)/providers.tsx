"use client"

import * as React from "react"
import { TooltipProvider } from "~/components/ui/tooltip"
import { StatsContext } from "~/hooks/use-stats-context"

interface ProviderProps extends React.PropsWithChildren {
  statsPromise: Promise<[number, number, number, number, number, number]>
}

export function Providers({ children, statsPromise }: ProviderProps) {
  const stats = React.use(statsPromise)

  return (
    <StatsContext.Provider value={stats}>
      <TooltipProvider delayDuration={250}>{children}</TooltipProvider>
    </StatsContext.Provider>
  )
}
