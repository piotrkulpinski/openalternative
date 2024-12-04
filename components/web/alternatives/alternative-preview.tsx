import Link from "next/link"
import { AlternativeList } from "~/components/web/alternatives/alternative-list"
import { Listing } from "~/components/web/listing"
import { cache } from "~/lib/cache"
import { alternativeManyPayload } from "~/server/web/alternatives/payloads"
import { findAlternatives } from "~/server/web/alternatives/queries"

const getAlternatives = cache(async () => {
  const list = [
    "monday",
    "notion",
    "airtable",
    "typeform",
    "teamwork",
    "todoist",
    "kissmetrics",
    "fathom-analytics",
  ]

  return await findAlternatives({
    where: { slug: { in: list } },
    include: alternativeManyPayload,
    take: 6,
  })
}, ["alternatives"])

const AlternativePreview = async () => {
  const alternatives = await getAlternatives()

  if (!alternatives.length) {
    return null
  }

  return (
    <Listing
      title="Discover Open Source alternatives to:"
      button={<Link href="/alternatives">View all alternatives</Link>}
      separated
    >
      <AlternativeList alternatives={alternatives} />
    </Listing>
  )
}

export { AlternativePreview }
