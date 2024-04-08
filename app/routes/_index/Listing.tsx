import { Hit as AlgoliaHit, UiState } from "instantsearch.js"
import { history } from "instantsearch.js/es/lib/routers"
import { ComponentProps } from "react"
import {
  InstantSearch,
  Configure,
  Hits,
  Highlight,
  Pagination,
  SearchBox,
} from "react-instantsearch-hooks-web"
import { searchClient } from "~/services.server/algolia"

type HitProps = {
  hit: AlgoliaHit<{
    name: string
    price: number
  }>
}

const Hit = ({ hit }: HitProps) => {
  return (
    <>
      <Highlight hit={hit} attribute="name" />
      <span>${hit.price}</span>
    </>
  )
}

export const Listing = ({ url }: { url: URL | string }) => {
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
      <Configure ruleContexts={[]} />
      <SearchBox placeholder="Search" />

      <Hits hitComponent={Hit} />
      <Pagination />
    </InstantSearch>
  )
}
