import type { Metadata } from "next"
import { type SearchParams, createLoader, parseAsString } from "nuqs/server"
import { AlternativesAdPicker } from "~/app/(web)/advertise/alternatives/ad-picker"
import { metadataConfig } from "~/config/metadata"
import { findAlternatives, findRelatedAlternativeIds } from "~/server/web/alternatives/queries"

type PageProps = {
  searchParams: Promise<SearchParams>
}

export const metadata: Metadata = {
  openGraph: { ...metadataConfig.openGraph, url: "/advertise/alternatives" },
  alternates: { ...metadataConfig.alternates, canonical: "/advertise/alternatives" },
}

export default async function AdvertiseAlternativesPage({ searchParams }: PageProps) {
  const searchParamsLoader = createLoader({ id: parseAsString.withDefault("") })
  const { id } = await searchParamsLoader(searchParams)

  const alternatives = await findAlternatives({
    where: { pageviews: { gte: 50 }, adPrice: { not: null }, ad: null },
    orderBy: { pageviews: "desc" },
  })

  const relatedIds: string[] = []

  if (id) {
    const ids = await findRelatedAlternativeIds({
      id,
      limit: 10,
      rankingScoreThreshold: 0.5,
      filter: `id IN [${alternatives.map(a => a.id).join(",")}]`,
    })

    relatedIds.push(...ids)
  }

  return (
    <AlternativesAdPicker alternatives={alternatives} selectedId={id} relatedIds={relatedIds} />
  )
}
