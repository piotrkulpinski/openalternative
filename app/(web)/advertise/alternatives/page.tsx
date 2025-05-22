import type { Metadata } from "next"
import { AlternativesAdPicker } from "~/app/(web)/advertise/alternatives/ad-picker"
import { metadataConfig } from "~/config/metadata"
import { findAlternatives } from "~/server/web/alternatives/queries"

export const metadata: Metadata = {
  openGraph: { ...metadataConfig.openGraph, url: "/advertise/alternatives" },
  alternates: { ...metadataConfig.alternates, canonical: "/advertise/alternatives" },
}

export default async function AdvertiseAlternativesPage() {
  const alternatives = await findAlternatives({
    where: { pageviews: { gte: 50 }, adPrice: { not: null } },
    orderBy: { pageviews: "desc" },
  })

  return <AlternativesAdPicker alternatives={alternatives} />
}
