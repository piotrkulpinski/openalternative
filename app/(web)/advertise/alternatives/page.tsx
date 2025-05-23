import type { Metadata } from "next"
import { type SearchParams, createLoader, parseAsArrayOf, parseAsString } from "nuqs/server"
import { AlternativesAdPicker } from "~/app/(web)/advertise/alternatives/ad-picker"
import { metadataConfig } from "~/config/metadata"
import { findAlternatives } from "~/server/web/alternatives/queries"

type PageProps = {
  searchParams: Promise<SearchParams>
}

export const metadata: Metadata = {
  openGraph: { ...metadataConfig.openGraph, url: "/advertise/alternatives" },
  alternates: { ...metadataConfig.alternates, canonical: "/advertise/alternatives" },
}

export default async function AdvertiseAlternativesPage({ searchParams }: PageProps) {
  const searchParamsLoader = createLoader({ slug: parseAsArrayOf(parseAsString).withDefault([]) })
  const { slug } = await searchParamsLoader(searchParams)

  const alternatives = await findAlternatives({
    where: { pageviews: { gte: 50 }, adPrice: { not: null }, ad: null },
    orderBy: { pageviews: "desc" },
  })

  const ids = alternatives.filter(a => slug.includes(a.slug)).map(({ id }) => id)

  return <AlternativesAdPicker alternatives={alternatives} defaultIds={ids} />
}
