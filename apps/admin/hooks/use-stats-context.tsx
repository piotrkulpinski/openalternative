import { createContext, useContext } from "react"

type Stats = [number, number, number, number, number, number]

const StatsContext = createContext<Stats | null>(null)

export const useStats = () => {
  const context = useContext(StatsContext)

  if (!context) {
    throw new Error("useStats must be used within a StatsProvider")
  }
  return context
}

export { StatsContext }
