import { Grid } from "apps/web/app/components/Grid"
import { H5 } from "apps/web/app/components/Heading"
import { SponsoringCard } from "apps/web/app/partials/records/SponsoringCard"
import { ToolRecord } from "apps/web/app/partials/records/ToolRecord"
import type { SponsoringOne, ToolOne } from "apps/web/app/services.server/api"
import { Fragment, type HTMLAttributes } from "react"
import { type UseHitsProps, useHits } from "react-instantsearch"

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
            <SponsoringCard sponsoring={sponsoring} className="sm:order-2" />
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
