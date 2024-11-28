import { type ComponentProps, Fragment } from "react"
import { AdCard } from "~/components/web/ads/ad-card"
import { EmptyList } from "~/components/web/empty-list"
import { ToolCard, ToolCardSkeleton } from "~/components/web/tools/tool-card"
import { Grid } from "~/components/web/ui/grid"
import type { AdOne } from "~/server/ads/payloads"
import type { ToolMany } from "~/server/tools/payloads"

type ToolListProps = ComponentProps<typeof Grid> & {
  tools: ToolMany[]
  ad?: AdOne | null
  showAd?: boolean
}

const ToolList = ({ tools, ad, showAd = true, ...props }: ToolListProps) => {
  return (
    <Grid {...props}>
      {tools.map((tool, order) => (
        <Fragment key={tool.id}>
          {showAd && Math.min(2, tools.length - 1) === order && (
            <AdCard ad={ad} className="sm:order-2" />
          )}

          <ToolCard tool={tool} style={{ order }} />
        </Fragment>
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
