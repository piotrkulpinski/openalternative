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
  showAd?: boolean
}

const AlternativeList = ({ alternatives, showAd = true, ...props }: AlternativeListProps) => {
  return (
    <Grid {...props}>
      {alternatives.map((alternative, order) => (
        <Fragment key={alternative.slug}>
          {showAd && Math.min(2, alternatives.length - 1) === order && (
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

const AlternativeListSkeleton = () => {
  return (
    <Grid>
      {[...Array(6)].map((_, index) => (
        <AlternativeCardSkeleton key={index} />
      ))}
    </Grid>
  )
}

export { AlternativeList, AlternativeListSkeleton }
