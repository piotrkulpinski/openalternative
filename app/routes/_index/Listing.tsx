import { Fragment, type HTMLAttributes } from "react"
import { type UseHitsProps, useHits } from "react-instantsearch"
import { Grid } from "~/components/Grid"
import { H5 } from "~/components/Heading"
import { SponsoredCard } from "~/components/SponsoredCard"
import { ToolRecord } from "~/partials/records/ToolRecord"
import type { SponsoringOne, ToolOne } from "~/services.server/api"

type ListingProps = HTMLAttributes<HTMLElement> &
  UseHitsProps<ToolOne> & {
    sponsoring: SponsoringOne | null
  }

export const Listing = ({ className, sponsoring, ...props }: ListingProps) => {
  const { hits, sendEvent } = useHits(props)

  return (
    <Grid className={className}>
      {hits.map((hit, order) => (
        <Fragment key={hit.id}>
          {Math.min(2, hits.length - 1) === order && <SponsoredCard sponsoring={sponsoring} />}

          <ToolRecord
            tool={hit}
            onClick={() => sendEvent("click", hit, "Hit Clicked")}
            onAuxClick={() => sendEvent("click", hit, "Hit Clicked")}
            style={{ order }}
          />
        </Fragment>
      ))}

      {!hits.length && <H5>No results found</H5>}
    </Grid>
  )
}
