import { ComponentProps, useRef } from "react"
import { ClientOnly } from "remix-utils/client-only"
import { InstantSearch } from "react-instantsearch"
import { history } from "instantsearch.js/es/lib/routers"
import { Pagination } from "./Pagination"
import { UiState } from "instantsearch.js"
import { Listing } from "./Listing"
import { searchClient } from "~/services.server/algolia"
import { Filters } from "./Filters"

export const Search = ({ url }: { url: URL | string }) => {
  const listingRef = useRef<HTMLDivElement>(null)
  const indexName = import.meta.env.VITE_ALGOLIA_INDEX_NAME!

  const instantSearchOptions: ComponentProps<typeof InstantSearch> = {
    searchClient,
    indexName,
    routing: {
      router: history({
        cleanUrlOnDispose: false,
        getLocation: () => {
          return (typeof window === "undefined" ? new URL(url) : window.location) as Location
        },
      }),

      stateMapping: {
        stateToRoute(uiState) {
          const indexUiState = uiState[indexName] || {}

          return {
            query: indexUiState.query,
            sortBy: indexUiState.sortBy,
            page: indexUiState.page,
            hitsPerPage: indexUiState.hitsPerPage,
            stars: indexUiState.range?.stars,
            forks: indexUiState.range?.forks,
            alternatives: indexUiState.refinementList?.alternatives,
            categories: indexUiState.refinementList?.categories,
            languages: indexUiState.refinementList?.languages,
            topics: indexUiState.refinementList?.topics,
          } as UiState
        },

        routeToState(routeState) {
          const state = routeState as UiState

          return {
            [indexName]: {
              query: state.query,
              sortBy: state.sortBy,
              page: state.page,
              hitsPerPage: state.hitsPerPage,
              range: {
                stars: state.stars,
                forks: state.forks,
              },
              refinementList: {
                alternatives: state.alternatives,
                categories: state.categories,
                languages: state.languages,
                topics: state.topics,
              },
            } as UiState,
          }
        },
      },
    },
    insights: { insightsInitParams: { useCookie: true } },
    future: { preserveSharedStateOnUnmount: true },
  }

  return (
    <InstantSearch {...instantSearchOptions}>
      <div ref={listingRef} className="flex flex-col gap-6 scroll-mt-14">
        <ClientOnly fallback={null}>{() => <Filters />}</ClientOnly>
        <Listing />
      </div>

      <Pagination listingRef={listingRef} padding={2} />
    </InstantSearch>
  )
}
