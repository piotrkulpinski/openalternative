import type { AdType } from "@prisma/client"
import { type ComponentProps, Fragment, Suspense } from "react"
import { AdCard, AdCardSkeleton } from "~/components/web/ads/ad-card"
import { EmptyList } from "~/components/web/empty-list"
import { ToolCard, ToolCardSkeleton } from "~/components/web/tools/tool-card"
import { Grid } from "~/components/web/ui/grid"
import type { ToolMany } from "~/server/web/tools/payloads"

type ToolListProps = ComponentProps<typeof Grid> & {
  tools: ToolMany[]
  adType?: AdType
  enableAds?: boolean
}

const ToolList = ({ tools, adType = "Tools", enableAds = true, ...props }: ToolListProps) => {
  return (
    <Grid {...props}>
      {tools.map((tool, order) => (
        <Fragment key={tool.slug}>
          {enableAds && Math.min(2, tools.length - 1) === order && (
            <Suspense fallback={<AdCardSkeleton className="lg:order-2" />}>
              <AdCard type={adType} className="lg:order-2" />
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
