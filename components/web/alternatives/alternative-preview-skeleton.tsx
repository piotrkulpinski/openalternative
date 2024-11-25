import { AlternativeListSkeleton } from "~/components/web/alternatives/alternative-list"
import { Listing } from "~/components/web/listing"

const AlternativePreviewSkeleton = () => {
  return (
    <Listing title="Discover Open Source alternatives to:" separated>
      <AlternativeListSkeleton />
    </Listing>
  )
}

export { AlternativePreviewSkeleton }
