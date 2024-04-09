import { ComponentProps, useRef } from "react"
import { InstantSearch, Configure } from "react-instantsearch-hooks-web"
import { history } from "instantsearch.js/es/lib/routers"
import { Pagination } from "./Pagination"
import { SearchBox } from "./SearchBox"
import { UiState } from "instantsearch.js"
import { SortBy } from "./SortBy"
import { Listing } from "./Listing"
import { searchClient } from "~/services.server/algolia"
import { Refinements } from "./Refinements"

export const Search = ({ url }: { url: URL | string }) => {
  const listingRef = useRef<HTMLDivElement>(null)
  const indexName = import.meta.env.VITE_ALGOLIA_INDEX_NAME!

  const instantSearchOptions: ComponentProps<typeof InstantSearch> = {
    searchClient,
    indexName,
    routing: {
      router: history({
        cleanUrlOnDispose: false,
        getLocation: () => (typeof window === "undefined" ? new URL(url) : window.location),
      }),
      stateMapping: {
        stateToRoute(uiState) {
          const indexUiState = uiState[indexName] || {}

          return {
            q: indexUiState.query,
            genres: indexUiState.refinementList?.genres,
          } as UiState
        },
        routeToState(routeState) {
          return {
            [indexName]: {
              query: routeState.q,
              refinementList: {
                genres: routeState.genres,
              },
            } as UiState,
          }
        },
      },
    },
    insights: true,
  }

  return (
    <InstantSearch {...instantSearchOptions}>
      <Configure hitsPerPage={30} ruleContexts={[]} />
      <div ref={listingRef} className="flex flex-col gap-6 scroll-mt-14">
        <div className="flex flex-wrap gap-x-2 gap-y-3 w-full">
          <SortBy
            items={[
              { value: "openalternative", label: "Default" },
              { value: "openalternative_name_asc", label: "Name" },
              { value: "openalternative_stars_desc", label: "Stars" },
              { value: "openalternative_forks_desc", label: "Forks" },
              { value: "openalternative_lastcommit_desc", label: "Last Commit" },
            ]}
          />

          <SearchBox className="flex-1" />
        </div>

        <Refinements />
        <Listing />
      </div>

      <Pagination listingRef={listingRef} padding={2} />
    </InstantSearch>
  )
}
