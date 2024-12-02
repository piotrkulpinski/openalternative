import type { SearchParams } from "nuqs/server"
import { ToolQuery } from "~/components/web/tools/tool-query"
import type { LanguageOne } from "~/server/languages/payloads"
import { searchTools } from "~/server/tools/queries"
import { toolsSearchParamsCache } from "~/server/tools/search-params"

type LanguageToolListingProps = {
  language: LanguageOne
  searchParams: Promise<SearchParams>
}

export const LanguageToolListing = async ({ language, searchParams }: LanguageToolListingProps) => {
  const parsedParams = toolsSearchParamsCache.parse(await searchParams)

  const { tools, totalCount } = await searchTools(parsedParams, {
    where: { languages: { some: { language: { slug: language.slug } } } },
  })

  return (
    <ToolQuery
      tools={tools}
      totalCount={totalCount}
      perPage={parsedParams.perPage}
      placeholder={`Search in ${language.name} tools...`}
    />
  )
}
