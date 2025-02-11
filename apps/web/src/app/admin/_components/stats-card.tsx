import { db } from "@openalternative/db"
import { Card, CardDescription, CardHeader } from "~/components/common/card"
import { H2 } from "~/components/common/heading"

export const StatsCard = async () => {
  const stats = await db.$transaction([
    db.tool.count(),
    db.alternative.count(),
    db.category.count(),
  ])

  const statsLabels = {
    0: "Tools",
    1: "Alternatives",
    2: "Categories",
  }

  return (
    <>
      {stats.map((stat, index) => (
        <Card key={index} hover={false} focus={false} className="col-span-full lg:col-span-2">
          <CardHeader direction="column">
            <CardDescription>{statsLabels[index as keyof typeof statsLabels]}</CardDescription>
            <H2 className="tabular-nums">{stat.toLocaleString()}</H2>
          </CardHeader>
        </Card>
      ))}
    </>
  )
}
