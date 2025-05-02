import { formatNumber } from "@curiousleaf/utils"
import { ToolStatus } from "@prisma/client"
import { subDays } from "date-fns"
import { unstable_cacheLife as cacheLife, unstable_cacheTag as cacheTag } from "next/cache"
import plur from "plur"
import { Badge } from "~/components/common/badge"
import { Link } from "~/components/common/link"
import { Ping } from "~/components/common/ping"
import { db } from "~/services/db"

const getCounts = async () => {
  "use cache"

  cacheTag("tools-count")
  cacheLife("minutes")

  return await db.$transaction([
    db.tool.count({
      where: { status: ToolStatus.Published },
    }),

    db.tool.count({
      where: { status: ToolStatus.Published, publishedAt: { gte: subDays(new Date(), 7) } },
    }),
  ])
}

const CountBadge = async () => {
  const [count, newCount] = await getCounts()

  return (
    <Badge prefix={<Ping />} className="order-first" asChild>
      <Link href="/latest">
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
