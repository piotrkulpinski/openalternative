import { useHits, type UseHitsProps } from "react-instantsearch"
import { Grid } from "~/components/Grid"
import { ToolOne } from "~/services.server/api"
import { ToolRecord } from "~/components/records/ToolRecord"
import { H5 } from "~/components/Heading"
import { HTMLAttributes } from "react"

type ListingProps = HTMLAttributes<HTMLElement> & UseHitsProps<ToolOne>

export const Listing = ({ className, ...props }: ListingProps) => {
  const { hits, sendEvent } = useHits(props)

  return (
    <Grid className={className}>
      {hits.map((hit) => (
        <ToolRecord
          key={hit.id}
          tool={hit}
          onClick={() => sendEvent("click", hit, "Hit Clicked")}
          onAuxClick={() => sendEvent("click", hit, "Hit Clicked")}
        />
      ))}

      {!hits.length && <H5>No results found</H5>}
    </Grid>
  )
}
