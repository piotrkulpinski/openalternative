import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { SearchParams } from "nuqs/server"
import { Suspense, cache } from "react"
import { ToolListSkeleton } from "~/components/web/tools/tool-list"
import { ToolListing } from "~/components/web/tools/tool-listing"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import type { LanguageOne } from "~/server/languages/payloads"
import { findLanguage, findLanguageSlugs } from "~/server/languages/queries"
import { parseMetadata } from "~/utils/metadata"

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

const getMetadata = (language: LanguageOne) => {
  const name = language.label || `${language.name} Tools`

  return {
    title: `Open Source ${name}`,
    description: `A curated collection of the ${language._count.tools} best open source ${name} for inspiration and reference. Each listing includes a website screenshot along with a detailed review of its features.`,
  } satisfies Metadata
}

export const generateStaticParams = async () => {
  const languages = await findLanguageSlugs({})
  return languages.map(({ slug }) => ({ slug }))
}

export const generateMetadata = async (props: PageProps) => {
  const language = await getLanguage(props)
  const url = `/languages/${language.slug}`

  return parseMetadata(
    Object.assign(getMetadata(language), {
      alternates: { canonical: url },
      openGraph: { url },
    }),
  )
}

export default async function LanguagePage(props: PageProps) {
  const language = await getLanguage(props)
  const { title, description } = getMetadata(language)

  return (
    <>
      <Intro>
        <IntroTitle>{title}</IntroTitle>
        <IntroDescription className="max-w-3xl">{description}</IntroDescription>
      </Intro>

      <Suspense fallback={<ToolListSkeleton />}>
        <ToolListing
          searchParams={props.searchParams}
          where={{ languages: { some: { language: { slug: language.slug } } } }}
          placeholder={`Search in ${language.name.toLowerCase()}...`}
        />
      </Suspense>
    </>
  )
}
