import { Link } from "~/components/common/link"
import { AlternativeList } from "~/components/web/alternatives/alternative-list"
import { Listing } from "~/components/web/listing"
import type { AlternativeOne } from "~/server/web/alternatives/payloads"
import {
  findFeaturedAlternatives,
  findRelatedAlternatives,
} from "~/server/web/alternatives/queries"

export const RelatedAlternatives = async ({ alternative }: { alternative: AlternativeOne }) => {
  let title = "Similar proprietary alternatives:"
  let alternatives = await findRelatedAlternatives(alternative.id)

  if (!alternatives.length) {
    title = "Featured alternatives:"
    alternatives = await findFeaturedAlternatives({ take: 6 })

    if (!alternatives.length) {
      return null
    }
  }

  return (
    <Listing title={title} button={<Link href="/alternatives">View all alternatives</Link>}>
      <AlternativeList alternatives={alternatives} enableAds={false} />
    </Listing>
  )
}
