import { Link } from "~/components/common/link"
import {
  AlternativeList,
  AlternativeListSkeleton,
} from "~/components/web/alternatives/alternative-list"
import { Listing } from "~/components/web/listing"
import { findFeaturedAlternatives } from "~/server/web/alternatives/queries"

const AlternativePreview = async () => {
  const alternatives = await findFeaturedAlternatives({ take: 6 })

  if (!alternatives.length) {
    return null
  }

  return (
    <Listing
      title="Discover Open Source alternatives to:"
      button={<Link href="/alternatives">View all alternatives</Link>}
      separated
    >
      <AlternativeList alternatives={alternatives} enableAds={false} />
    </Listing>
  )
}

const AlternativePreviewSkeleton = () => {
  return (
    <Listing title="Discover Open Source alternatives to:">
      <AlternativeListSkeleton />
    </Listing>
  )
}

export { AlternativePreview, AlternativePreviewSkeleton }
