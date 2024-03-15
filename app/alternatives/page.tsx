import { Metadata } from "next"
import { cache } from "react"
import { Grid } from "~/components/Grid"
import { Intro } from "~/components/Intro"
import { AlternativeCard } from "~/components/cards/AlternativeCard"
import { getAlternativesQuery, type Alternative } from "~/queries/alternatives"
import { getClient } from "~/services/apollo"
import { parseMetadata } from "~/utils/metadata"

export const dynamic = "force-static"

// Getters
const getAlternatives = cache(async () => {
  const { data } = await getClient().query({
    query: getAlternativesQuery,
  })

  return data.alternatives
})

const getMetadata = cache((metadata?: Metadata) => ({
  ...metadata,
  title: "Open Source Software Alternatives",
  description: "Browse top alternatives to find your best Open Source software options.",
}))

// Dynamic Metadata
export const generateMetadata = async ({}): Promise<Metadata> => {
  const url = "/alternatives"

  const metadata = getMetadata({
    alternates: { canonical: url },
    openGraph: { url },
  })

  return parseMetadata(metadata)
}

// Component
export default async function Alternatives() {
  const alternatives = await getAlternatives()
  const metadata = getMetadata()

  return (
    <>
      <Intro title={metadata.title} description={metadata.description} />

      <Grid>
        {alternatives?.map((alternative) => (
          <AlternativeCard key={alternative?.id} alternative={alternative as Alternative} />
        ))}
      </Grid>
    </>
  )
}
