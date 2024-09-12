"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { useStats } from "~/hooks/use-stats-context"

export const StatsCard = async () => {
  const stats = useStats()

  const statsLabels = {
    0: "Tools",
    1: "Alternatives",
    2: "Categories",
    3: "Languages",
    4: "Topics",
    5: "Licenses",
  }

  return (
    <>
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader>
            <CardDescription>{statsLabels[index as keyof typeof statsLabels]}</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{stat.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
      ))}
    </>
  )
}
