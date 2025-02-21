import { formatDistanceToNowStrict } from "date-fns"
import type { ComponentProps } from "react"
import { Card, CardDescription, CardHeader } from "~/components/common/card"
import { H2 } from "~/components/common/heading"
import { Link } from "~/components/common/link"
import { ScrollArea } from "~/components/common/scroll-area"
import { Tooltip, TooltipProvider } from "~/components/common/tooltip"
import { findScheduledTools } from "~/server/admin/tools/queries"

const ScheduledCard = async ({ ...props }: ComponentProps<typeof Card>) => {
  const tools = await findScheduledTools()

  return (
    <Card hover={false} focus={false} {...props}>
      <CardHeader direction="column">
        <CardDescription>Scheduled Tools</CardDescription>
        <H2 className="tabular-nums">{tools.length}</H2>
      </CardHeader>

      {tools.length ? (
        <TooltipProvider delayDuration={0} disableHoverableContent>
          <ScrollArea className="px-4 -mx-4 max-h-56 self-stretch text-sm">
            {tools.map(tool => (
              <Link
                key={tool.slug}
                href={`/admin/tools/${tool.slug}`}
                className="group flex items-center gap-3 py-1"
              >
                <span className="font-medium truncate">{tool.name}</span>
                <hr className="min-w-2 flex-1" />

                {tool.publishedAt && (
                  <Tooltip tooltip={tool.publishedAt.toISOString()}>
                    <span className="shrink-0 text-muted-foreground group-hover:text-foreground">
                      {formatDistanceToNowStrict(tool.publishedAt, { addSuffix: true })}
                    </span>
                  </Tooltip>
                )}
              </Link>
            ))}
          </ScrollArea>
        </TooltipProvider>
      ) : (
        <p className="text-sm text-muted-foreground">No upcoming tools at the moment.</p>
      )}
    </Card>
  )
}

export { ScheduledCard }
