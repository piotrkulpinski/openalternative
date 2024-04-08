import useSWR from "swr"
import { HTMLAttributes, MutableRefObject } from "react"
import { cx } from "~/utils/cva"
import { H6 } from "~/components/Heading"
import { fetcher } from "~/utils/fetchers"
import { SWR_CONFIG } from "~/utils/constants"
import { AlternativeMany, CategoryMany, LanguageMany, TopicMany } from "~/services.server/api"
import { Badge } from "~/components/Badge"
import { useToolsContext } from "~/store/tools"

type AdvancedFiltersProps = HTMLAttributes<HTMLDivElement> & {
  submitRef: MutableRefObject<HTMLButtonElement | null>
}

type FetcherResponse = {
  alternatives: AlternativeMany[]
  categories: CategoryMany[]
  languages: LanguageMany[]
  topics: TopicMany[]
}

export const AdvancedFilters = ({ className, submitRef, ...props }: AdvancedFiltersProps) => {
  const searchParams = useToolsContext((s) => s.searchParams)

  const { data, error, isLoading } = useSWR<FetcherResponse>(
    { url: "/api/filters" },
    fetcher,
    SWR_CONFIG
  )

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <div className={cx("flex gap-4 w-full py-3 px-4 border rounded-md", className)} {...props}>
      <div className="flex flex-col gap-2 max-w-48">
        <H6>Alternatives</H6>
        <div className="flex flex-col pr-4 max-h-64 overflow-auto overscroll-contain">
          {data?.alternatives.map((alternative) => (
            <label key={alternative.slug} className="flex items-center gap-2.5 text-[13px]">
              <input
                type="checkbox"
                name="alternative"
                value={alternative.slug}
                checked={searchParams.alternative?.includes(alternative.slug)}
                onChange={() => submitRef.current?.click()}
              />
              <span className="flex-1 truncate">{alternative.name}</span>
              <Badge size="sm">{alternative._count.tools}</Badge>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 max-w-48">
        <H6>Categories</H6>
        <div className="flex flex-col pr-4 max-h-64 overflow-auto overscroll-contain">
          {data?.categories.map((category) => (
            <label key={category.slug} className="flex items-center gap-2.5 text-[13px]">
              <input
                type="checkbox"
                name="category"
                value={category.slug}
                checked={searchParams.category?.includes(category.slug)}
                onChange={() => submitRef.current?.click()}
              />
              <span className="flex-1 truncate">{category.name}</span>
              <Badge size="sm">{category._count.tools}</Badge>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 max-w-48">
        <H6>Languages</H6>
        <div className="flex flex-col pr-4 max-h-64 overflow-auto overscroll-contain">
          {data?.languages.map((language) => (
            <label key={language.slug} className="flex items-center gap-2.5 text-[13px]">
              <input
                type="checkbox"
                name="language"
                value={language.slug}
                checked={searchParams.language?.includes(language.slug)}
                onChange={() => submitRef.current?.click()}
              />
              <span className="flex-1 truncate">{language.name}</span>
              <Badge size="sm">{language._count.tools}</Badge>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 max-w-48">
        <H6>Topics</H6>
        <div className="flex flex-col pr-4 max-h-64 overflow-auto overscroll-contain">
          {data?.topics.map((topic) => (
            <label key={topic.slug} className="flex items-center gap-2.5 text-[13px]">
              <input
                type="checkbox"
                name="topic"
                value={topic.slug}
                checked={searchParams.topic?.includes(topic.slug)}
                onChange={() => submitRef.current?.click()}
              />
              <span className="flex-1 truncate">{topic.slug}</span>
              <Badge size="sm">{topic._count.tools}</Badge>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
