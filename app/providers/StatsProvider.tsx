import { createContext, PropsWithChildren } from "react"

export type StatsContext = {
  tools: number
  stars: number
  subscribers: number
} | null

export const StatsContext = createContext<StatsContext>(null)

export const StatsProvider = ({ children, stats }: PropsWithChildren<{ stats: StatsContext }>) => {
  return <StatsContext.Provider value={stats}>{children}</StatsContext.Provider>
}
