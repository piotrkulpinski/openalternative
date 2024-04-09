import { HTMLAttributes } from "react"
import { cx } from "~/utils/cva"
import { H6 } from "~/components/Heading"
import { Badge } from "~/components/Badge"
import { useRefinementList } from "react-instantsearch-hooks-web"

export const Refinements = ({ className, ...props }: HTMLAttributes<HTMLElement>) => {
  const alternativeRefinements = useRefinementList({
    attribute: "alternatives.name",
  })
  const categoryRefinements = useRefinementList({
    attribute: "categories.name",
  })
  const languageRefinements = useRefinementList({
    attribute: "languages.name",
  })
  const topicRefinements = useRefinementList({
    attribute: "topics.slug",
  })

  const refinements = [
    { label: "Alternatives", ...alternativeRefinements },
    { label: "Categories", ...categoryRefinements },
    { label: "Languages", ...languageRefinements },
    { label: "Topics", ...topicRefinements },
  ]

  return (
    <div className={cx("flex gap-4 w-full py-3 px-4 border rounded-md", className)} {...props}>
      {refinements.map(
        ({ label, items, refine, isShowingMore, toggleShowMore, canToggleShowMore }) => (
          <div key={label} className="flex flex-col gap-2 max-w-48">
            <H6>{label}</H6>

            <div className="flex flex-col pr-4 max-h-64 overflow-auto overscroll-contain">
              {items?.map((item) => (
                <label key={item.label} className="flex items-center gap-2.5 text-[13px]">
                  <input
                    type="checkbox"
                    checked={item.isRefined}
                    onChange={() => refine(item.value)}
                  />
                  <span className="flex-1 truncate">{item.label}</span>
                  <Badge size="sm">{item.count}</Badge>
                </label>
              ))}
            </div>

            <button onClick={toggleShowMore} disabled={!canToggleShowMore}>
              {isShowingMore ? "Show less" : "Show more"}
            </button>
          </div>
        )
      )}

      {/* <div className="flex flex-col gap-2 max-w-48">
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
      </div> */}
    </div>
  )
}
