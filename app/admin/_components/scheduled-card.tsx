import { formatDate } from "@curiousleaf/utils"
import { unstable_cacheLife as cacheLife } from "next/cache"
import Link from "next/link"
import type { ComponentProps } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/admin/ui/card"
import { ScrollArea } from "~/components/admin/ui/scroll-area"
import { prisma } from "~/services/prisma"

const ScheduledCard = async ({ ...props }: ComponentProps<typeof Card>) => {
  "use cache"
  cacheLife("hours")

  const tools = await prisma.tool.findMany({
    where: { status: "Scheduled" },
    select: { slug: true, name: true, publishedAt: true },
    orderBy: { publishedAt: "asc" },
  })

  return (
    <Card {...props}>
      <CardHeader>
        <CardDescription>Scheduled Tools</CardDescription>
        <CardTitle className="text-3xl tabular-nums">{tools.length}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-1 flex-1 text-sm">
        {tools.length ? (
          <ScrollArea className="px-4 -mx-4 lg:h-56">
            {tools.map(tool => (
              <Link
                key={tool.slug}
                href={`/admin/tools/${tool.slug}`}
                className="group flex items-center gap-3 py-1"
              >
                <span className="font-medium truncate">{tool.name}</span>
                <hr className="min-w-2 flex-1" />

                {tool.publishedAt && (
                  <span className="shrink-0 text-muted-foreground group-hover:text-foreground">
                    {formatDate(tool.publishedAt)}
                  </span>
                )}
              </Link>
            ))}
          </ScrollArea>
        ) : (
          <p className="text-muted-foreground">No upcoming tools at the moment.</p>
        )}
      </CardContent>
    </Card>
  )
}

export { ScheduledCard }
