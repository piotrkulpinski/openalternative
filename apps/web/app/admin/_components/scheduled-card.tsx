import type { ComponentProps } from "react"
import { Card, CardDescription, CardHeader } from "~/components/common/card"
import { H2 } from "~/components/common/heading"
import { findScheduledTools } from "~/server/admin/tools/queries"
import { Calendar } from "./calendar"

const ScheduledCard = async ({ ...props }: ComponentProps<typeof Card>) => {
  const tools = await findScheduledTools()

  return (
    <Card hover={false} focus={false} {...props}>
      <CardHeader direction="column">
        <CardDescription>Scheduled Tools</CardDescription>
        <H2 className="tabular-nums">{tools.length}</H2>
      </CardHeader>

      {tools.length ? (
        <Calendar tools={tools} className="w-full h-full" />
      ) : (
        <p className="text-sm text-muted-foreground">No scheduled tools at the moment.</p>
      )}
    </Card>
  )
}

export { ScheduledCard }
