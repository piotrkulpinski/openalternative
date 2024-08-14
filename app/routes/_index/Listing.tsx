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
  const { items, sendEvent } = useHits(props)

  return (
    <Grid className={className}>
      {items.map((item, order) => (
        <Fragment key={item.id}>
          {Math.min(2, items.length - 1) === order && (
            <SponsoredCard sponsoring={sponsoring} className="sm:order-2" />
          )}

          <ToolRecord
            tool={item}
            onClick={() => sendEvent("click", item, "Hit Clicked")}
            onAuxClick={() => sendEvent("click", item, "Hit Clicked")}
            style={{ order }}
          />
        </Fragment>
      ))}

      {!items.length && <H5>No results found</H5>}
    </Grid>
  )
}
