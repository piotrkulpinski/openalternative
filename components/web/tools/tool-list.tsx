import type { ComponentProps } from "react"
import { EmptyList } from "~/components/web/empty-list"
import { ToolCard, ToolCardSkeleton } from "~/components/web/tools/tool-card"
import { Grid } from "~/components/web/ui/grid"
import type { ToolMany } from "~/server/tools/payloads"

type ToolListProps = ComponentProps<typeof Grid> & {
  tools: ToolMany[]
}

const ToolList = ({ tools, ...props }: ToolListProps) => {
  return (
    <Grid {...props}>
      {tools.map(tool => (
        <ToolCard key={tool.id} tool={tool} />
      ))}

      {!tools.length && <EmptyList>No tools found.</EmptyList>}
    </Grid>
  )
}

const ToolListSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <Grid>
      {[...Array(count)].map((_, index) => (
        <ToolCardSkeleton key={index} />
      ))}
    </Grid>
  )
}

export { ToolList, ToolListSkeleton }
