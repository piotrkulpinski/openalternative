import { type ComponentProps, Fragment, Suspense } from "react"
import { AdCard, AdCardSkeleton } from "~/components/web/ads/ad-card"
import { EmptyList } from "~/components/web/empty-list"
import { ToolCard, ToolCardSkeleton } from "~/components/web/tools/tool-card"
import { Grid } from "~/components/web/ui/grid"
import type { ToolMany } from "~/server/web/tools/payloads"

type ToolListProps = ComponentProps<typeof Grid> & {
  tools: ToolMany[]
  showAd?: boolean
}

const ToolList = ({ tools, showAd = true, ...props }: ToolListProps) => {
  return (
    <Grid {...props}>
      {tools.map((tool, order) => (
        <Fragment key={tool.slug}>
          {showAd && Math.min(2, tools.length - 1) === order && (
            <Suspense fallback={<AdCardSkeleton className="sm:order-2" />}>
              <AdCard type="Tools" className="sm:order-2" />
            </Suspense>
          )}

          <ToolCard tool={tool} style={{ order }} />
        </Fragment>
      ))}

      {!tools.length && <EmptyList>No tools found for the given filters.</EmptyList>}
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

export { ToolList, ToolListSkeleton, type ToolListProps }
