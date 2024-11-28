import { formatNumber } from "@curiousleaf/utils"
import { subDays } from "date-fns"
import Link from "next/link"
import plur from "plur"
import { Badge } from "~/components/web/ui/badge"
import { Ping } from "~/components/web/ui/ping"
import { prisma } from "~/services/prisma"

const CountBadge = async () => {
  const [toolsCount, newToolsCount] = await prisma.$transaction([
    prisma.tool.count({ where: { publishedAt: { lte: new Date() } } }),
    prisma.tool.count({ where: { publishedAt: { lte: new Date(), gte: subDays(new Date(), 7) } } }),
  ])

  return (
    <Badge prefix={<Ping />} className="order-first" asChild>
      <Link href="/?sort=publishedAt.desc">
        {newToolsCount
          ? `${formatNumber(newToolsCount)} new ${plur("tool", newToolsCount)} added`
          : `${formatNumber(toolsCount)}+ open source tools`}
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
