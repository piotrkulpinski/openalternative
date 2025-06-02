import Link from "next/link"
import { Card, CardDescription, CardHeader } from "~/components/common/card"
import { H2 } from "~/components/common/heading"
import { db } from "~/services/db"

export const StatsCard = async () => {
  const stats = [
    { label: "Tools", href: "/admin/tools", query: () => db.tool.count() },
    { label: "Alternatives", href: "/admin/alternatives", query: () => db.alternative.count() },
    { label: "Categories", href: "/admin/categories", query: () => db.category.count() },
    { label: "Users", href: "/admin/users", query: () => db.user.count() },
  ] as const

  const counts = await db.$transaction(stats.map(stat => stat.query()))

  return (
    <>
      {stats.map((stat, index) => (
        <Card key={stat.label} asChild>
          <Link href={stat.href}>
            <CardHeader direction="column">
              <CardDescription>{stat.label}</CardDescription>
              <H2>{counts[index].toLocaleString()}</H2>
            </CardHeader>
          </Link>
        </Card>
      ))}
    </>
  )
}
