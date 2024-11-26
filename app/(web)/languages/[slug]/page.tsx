import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { SearchParams } from "nuqs/server"
import { Suspense, cache } from "react"
import { LanguageToolListing } from "~/app/(web)/languages/[slug]/listing"
import { ToolQuerySkeleton } from "~/components/web/tools/tool-query"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"
import type { LanguageOne } from "~/server/languages/payloads"
import { findLanguage, findLanguageSlugs } from "~/server/languages/queries"

export const revalidate = 86400 // 24 hours

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<SearchParams>
}

const getLanguage = cache(async ({ params }: PageProps) => {
  const { slug } = await params
  const language = await findLanguage({ where: { slug } })

  if (!language) {
    notFound()
  }

  return language
})

const getMetadata = (language: LanguageOne): Metadata => {
  return {
    title: `${language.name} Open Source Projects`,
    description: `A curated collection of the ${language._count.tools} best open source software written in ${language.name}. Find the most popular and trending open source projects to learn from, contribute to, or use in your own projects.`,
  }
}

export const generateStaticParams = async () => {
  const languages = await findLanguageSlugs({})
  return languages.map(({ slug }) => ({ slug }))
}

export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const language = await getLanguage(props)
  const url = `/languages/${language.slug}`

  return {
    ...getMetadata(language),
    alternates: { ...metadataConfig.alternates, canonical: url },
    openGraph: { ...metadataConfig.openGraph, url },
  }
}

export default async function LanguagePage(props: PageProps) {
  const language = await getLanguage(props)
  const { title, description } = getMetadata(language)

  return (
    <>
      <Intro>
        <IntroTitle>{`${title}`}</IntroTitle>
        <IntroDescription className="max-w-3xl">{description}</IntroDescription>
      </Intro>

      <Suspense fallback={<ToolQuerySkeleton />}>
        <LanguageToolListing language={language} searchParams={props.searchParams} />
      </Suspense>
    </>
  )
}
