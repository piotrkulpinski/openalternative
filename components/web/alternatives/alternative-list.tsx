import { type ComponentProps, Fragment, Suspense } from "react"
import { AdCard, AdCardSkeleton } from "~/components/web/ads/ad-card"
import {
  AlternativeCard,
  AlternativeCardSkeleton,
} from "~/components/web/alternatives/alternative-card"
import { EmptyList } from "~/components/web/empty-list"
import { Grid } from "~/components/web/ui/grid"
import type { AlternativeMany } from "~/server/web/alternatives/payloads"

type AlternativeListProps = ComponentProps<typeof Grid> & {
  alternatives: AlternativeMany[]
  enableAds?: boolean
}

const AlternativeList = ({ alternatives, enableAds = true, ...props }: AlternativeListProps) => {
  return (
    <Grid {...props}>
      {alternatives.map((alternative, order) => (
        <Fragment key={alternative.slug}>
          {enableAds && Math.min(2, alternatives.length - 1) === order && (
            <Suspense fallback={<AdCardSkeleton className="sm:order-2" />}>
              <AdCard type="Alternatives" className="sm:order-2" />
            </Suspense>
          )}

          <AlternativeCard
            key={alternative.slug}
            alternative={alternative}
            style={{ order }}
            showCount
          />
        </Fragment>
      ))}

      {!alternatives.length && <EmptyList>No alternatives found.</EmptyList>}
    </Grid>
  )
}

const AlternativeListSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <Grid>
      {[...Array(count)].map((_, index) => (
        <AlternativeCardSkeleton key={index} />
      ))}
    </Grid>
  )
}

export { AlternativeList, AlternativeListSkeleton, type AlternativeListProps }
