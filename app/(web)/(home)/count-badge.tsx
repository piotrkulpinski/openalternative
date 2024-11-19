import { formatNumber } from "@curiousleaf/utils"
import { subDays } from "date-fns"
import Link from "next/link"
import plur from "plur"
import { Badge } from "~/components/web/ui/badge"
import { Ping } from "~/components/web/ui/ping"
import { countTools } from "~/server/tools/queries"

const CountBadge = async () => {
  const [toolsCount, newToolsCount] = await Promise.all([
    countTools({ where: { publishedAt: { lte: new Date() } } }),
    countTools({ where: { publishedAt: { lte: new Date(), gte: subDays(new Date(), 7) } } }),
  ])

  return (
    <Badge size="lg" prefix={<Ping />} className="order-first" asChild>
      <Link href="/latest">
        {newToolsCount
          ? `${formatNumber(newToolsCount)} new ${plur("tool", newToolsCount)} added`
          : `${formatNumber(toolsCount)}+ open source tools`}
      </Link>
    </Badge>
  )
}

const CountBadgeSkeleton = () => {
  return (
    <Badge
      size="lg"
      prefix={<Ping />}
      className="min-w-20 order-first pointer-events-none animate-pulse"
    >
      &nbsp;
    </Badge>
  )
}

export { CountBadge, CountBadgeSkeleton }
