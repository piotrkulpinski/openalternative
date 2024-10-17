import { posthog } from "posthog-js"
import { Fragment, type HTMLAttributes } from "react"
import { type UseHitsProps, useHits } from "react-instantsearch"
import { SponsoringCard } from "~/components/records/sponsoring-card"
import { ToolRecord } from "~/components/records/tool-record"
import { Grid } from "~/components/ui/grid"
import { H5 } from "~/components/ui/heading"
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
            <SponsoringCard sponsoring={sponsoring} className="sm:order-2" />
          )}

          <ToolRecord
            tool={item}
            onClick={() => {
              sendEvent("click", item, "Hit Clicked")
              item.isFeatured && posthog.capture("featured_tool_clicked", { slug: item.slug })
            }}
            onAuxClick={() => sendEvent("click", item, "Hit Clicked")}
            style={{ order }}
          />
        </Fragment>
      ))}

      {!items.length && <H5>No results found</H5>}
    </Grid>
  )
}
