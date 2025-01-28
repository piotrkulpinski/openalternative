import { db } from "@openalternative/db"
import { Card, CardDescription, CardHeader, CardTitle } from "~/components/admin/ui/card"
import { cache } from "~/lib/cache"

const getStats = cache(async () => {
  return await db.$transaction([db.tool.count(), db.alternative.count(), db.category.count()])
}, ["stats"])

export const StatsCard = async () => {
  const stats = await getStats()

  const statsLabels = {
    0: "Tools",
    1: "Alternatives",
    2: "Categories",
  }

  return (
    <>
      {stats.map((stat, index) => (
        <Card key={index} className="col-span-full lg:col-span-2">
          <CardHeader>
            <CardDescription>{statsLabels[index as keyof typeof statsLabels]}</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{stat.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
      ))}
    </>
  )
}
