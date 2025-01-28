import { formatNumber } from "@curiousleaf/utils"
import { db } from "@openalternative/db"
import { ToolStatus } from "@openalternative/db/client"
import { subDays } from "date-fns"
import Link from "next/link"
import plur from "plur"
import { Badge } from "~/components/web/ui/badge"
import { Ping } from "~/components/web/ui/ping"
import { cache } from "~/lib/cache"

const getCounts = cache(
  async () => {
    return await db.$transaction([
      db.tool.count({
        where: { status: ToolStatus.Published },
      }),

      db.tool.count({
        where: { status: ToolStatus.Published, publishedAt: { gte: subDays(new Date(), 7) } },
      }),
    ])
  },
  ["tools-count"],
  { revalidate: 60 * 60 },
)

const CountBadge = async () => {
  const [count, newCount] = await getCounts()

  return (
    <Badge prefix={<Ping />} className="order-first" asChild>
      <Link href="/?sort=publishedAt.desc" prefetch={false}>
        {newCount
          ? `${formatNumber(newCount)} new ${plur("tool", newCount)} added`
          : `${formatNumber(count)}+ open source tools`}
      </Link>
    </Badge>
  )
}

const CountBadgeSkeleton = () => {
  return (
    <Badge prefix={<Ping />} className="min-w-20 order-first pointer-events-none animate-pulse">
      &nbsp;
    </Badge>
  )
}

export { CountBadge, CountBadgeSkeleton }
