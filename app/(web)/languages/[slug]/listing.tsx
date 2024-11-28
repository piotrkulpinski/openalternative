import type { SearchParams } from "nuqs/server"
import { ToolQuery } from "~/components/web/tools/tool-query"
import { findAd } from "~/server/ads/queries"
import type { LanguageOne } from "~/server/languages/payloads"
import { searchTools } from "~/server/tools/queries"

type LanguageToolListingProps = {
  language: LanguageOne
  searchParams: Promise<SearchParams>
}

export const LanguageToolListing = async ({ language, searchParams }: LanguageToolListingProps) => {
  const [{ tools, totalCount }, ad] = await Promise.all([
    searchTools(searchParams, {
      where: { languages: { some: { language: { slug: language.slug } } } },
    }),
    findAd({ where: { type: "Homepage" } }),
  ])

  return (
    <ToolQuery
      tools={tools}
      totalCount={totalCount}
      ad={ad}
      placeholder={`Search in ${language.name} tools...`}
    />
  )
}
