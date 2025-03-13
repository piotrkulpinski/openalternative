import { db } from "@openalternative/db"
import { Card, CardDescription, CardHeader } from "~/components/common/card"
import { H2 } from "~/components/common/heading"

export const StatsCard = async () => {
  const stats = [
    { label: "Tools", query: () => db.tool.count() },
    { label: "Alternatives", query: () => db.alternative.count() },
    { label: "Categories", query: () => db.category.count() },
    { label: "Users", query: () => db.user.count() },
  ] as const

  const counts = await db.$transaction(stats.map(stat => stat.query()))

  return (
    <>
      {stats.map((stat, index) => (
        <Card key={stat.label} hover={false} focus={false}>
          <CardHeader direction="column">
            <CardDescription>{stat.label}</CardDescription>
            <H2 className="">{counts[index].toLocaleString()}</H2>
          </CardHeader>
        </Card>
      ))}
    </>
  )
}
