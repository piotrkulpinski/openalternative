import Link from "next/link"
import { AlternativeList } from "~/components/web/alternatives/alternative-list"
import { Listing } from "~/components/web/listing"
import { alternativeManyPayload } from "~/server/alternatives/payloads"
import { findAlternatives } from "~/server/alternatives/queries"

const AlternativePreview = async () => {
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

  const alternatives = await findAlternatives({
    where: { slug: { in: list } },
    include: alternativeManyPayload,
    take: 6,
  })

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
