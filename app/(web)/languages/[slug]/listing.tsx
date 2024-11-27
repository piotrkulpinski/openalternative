import type { SearchParams } from "nuqs/server"
import { ToolQuery } from "~/components/web/tools/tool-query"
import type { LanguageOne } from "~/server/languages/payloads"
import { searchTools } from "~/server/tools/queries"

type LanguageToolListingProps = {
  language: LanguageOne
  searchParams: Promise<SearchParams>
}

export const LanguageToolListing = async ({ language, searchParams }: LanguageToolListingProps) => {
  const { tools, totalCount } = await searchTools(searchParams, {
    where: { languages: { some: { language: { slug: language.slug } } } },
  })

  return (
    <ToolQuery
      tools={tools}
      totalCount={totalCount}
      placeholder={`Search in ${language.name} tools...`}
    />
  )
}
