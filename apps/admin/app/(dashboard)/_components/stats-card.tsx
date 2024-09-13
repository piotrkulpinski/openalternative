import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { prisma } from "~/services/prisma"

export const StatsCard = async () => {
  const stats = await Promise.all([
    prisma.tool.count(),
    prisma.alternative.count(),
    prisma.category.count(),
    prisma.language.count(),
    prisma.topic.count(),
    prisma.license.count(),
  ])

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
