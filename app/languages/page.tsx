import { Intro } from "~/components/Intro"
import { getClient } from "~/services/apollo"
import { getLanguagesQuery, type Language } from "~/queries/languages"
import { Grid } from "~/components/Grid"
import { LanguageCard } from "~/components/cards/LanguageCard"
import { cache } from "react"
import { Metadata } from "next"
import { parseMetadata } from "~/utils/metadata"

export const dynamic = "force-static"

// Getters
const getLanguages = cache(async () => {
  const { data } = await getClient().query({
    query: getLanguagesQuery,
  })

  return data.languages
})

const getMetadata = cache((metadata?: Metadata) => ({
  ...metadata,
  title: "Most Popular Languages used in Open Source Software",
  description: "Browse top languages to find your best Open Source software options.",
}))

// Dynamic Metadata
export const generateMetadata = async ({}): Promise<Metadata> => {
  const url = "/languages"

  const metadata = getMetadata({
    alternates: { canonical: url },
    openGraph: { url },
  })

  return parseMetadata(metadata)
}

// Component
export default async function Languages() {
  const languages = await getLanguages()
  const metadata = getMetadata()

  return (
    <>
      <Intro title={metadata.title} description={metadata.description} />

      <Grid>
        {languages?.map((language) => (
          <LanguageCard key={language?.id} language={language as Language} />
        ))}
      </Grid>
    </>
  )
}
