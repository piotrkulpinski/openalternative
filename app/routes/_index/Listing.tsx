import { Fragment, type HTMLAttributes } from "react"
import { type UseHitsProps, useHits } from "react-instantsearch"
import { Grid } from "~/components/Grid"
import { H5 } from "~/components/Heading"
import { SponsoredCard } from "~/components/SponsoredCard"
import { ToolRecord } from "~/components/records/ToolRecord"
import type { ToolOne } from "~/services.server/api"

type ListingProps = HTMLAttributes<HTMLElement> & UseHitsProps<ToolOne>

export const Listing = ({ className, ...props }: ListingProps) => {
  const { hits, sendEvent } = useHits(props)

  return (
    <Grid className={className}>
      {hits.map((hit, order) => {
        if (Math.min(2, hits.length - 1) === order) {
          return (
            <Fragment key={hit.id}>
              <SponsoredCard />

              <ToolRecord
                key={hit.id}
                tool={hit}
                onClick={() => sendEvent("click", hit, "Hit Clicked")}
                onAuxClick={() => sendEvent("click", hit, "Hit Clicked")}
                style={{ order }}
              />
            </Fragment>
          )
        }

        return (
          <ToolRecord
            key={hit.id}
            tool={hit}
            onClick={() => sendEvent("click", hit, "Hit Clicked")}
            onAuxClick={() => sendEvent("click", hit, "Hit Clicked")}
            style={{ order }}
          />
        )
      })}

      {!hits.length && <H5>No results found</H5>}
    </Grid>
  )
}
