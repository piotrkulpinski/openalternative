import { formatDistanceToNowStrict } from "date-fns"
import Link from "next/link"
import type { ComponentProps } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Skeleton } from "~/components/ui/skeleton"
import { prisma } from "~/services/prisma"

export const ScheduledToolsCard = async ({ ...props }: ComponentProps<typeof Card>) => {
  const tools = await prisma.tool.findMany({
    where: { publishedAt: { gt: new Date() } },
    select: { id: true, name: true, publishedAt: true },
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
                key={tool.id}
                href={`/tools/${tool.id}`}
                className="group flex items-center gap-3 py-1"
              >
                <span className="font-medium truncate">{tool.name}</span>
                <hr className="min-w-2 flex-1" />

                {tool.publishedAt && (
                  <span className="shrink-0 text-muted-foreground group-hover:text-foreground">
                    {formatDistanceToNowStrict(tool.publishedAt, { addSuffix: true })}
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

export const ScheduledToolsCardSkeleton = ({ ...props }: ComponentProps<typeof Card>) => {
  return (
    <Card {...props}>
      <CardHeader>
        <Skeleton className="h-5 w-12" />
        <Skeleton className="text-3xl w-24">&nbsp;</Skeleton>
      </CardHeader>

      <CardContent>
        <Skeleton className="h-56 w-full" />
      </CardContent>
    </Card>
  )
}
