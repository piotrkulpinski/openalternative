import { ComponentProps, useRef } from "react"
import { ClientOnly } from "remix-utils/client-only"
import { InstantSearch, Configure } from "react-instantsearch"
import { history } from "instantsearch.js/es/lib/routers"
import { Pagination } from "./Pagination"
import { Listing } from "./Listing"
import { searchClient } from "~/services.server/algolia"
import { Filters } from "./Filters"
import { Input } from "~/components/forms/Input"

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
    },
    future: { preserveSharedStateOnUnmount: true },
  }

  return (
    <InstantSearch {...instantSearchOptions}>
      <Configure />

      <div ref={listingRef} className="flex flex-col gap-6 scroll-mt-14">
        <ClientOnly fallback={<Input disabled />}>{() => <Filters />}</ClientOnly>
        <Listing />
      </div>

      <Pagination listingRef={listingRef} padding={2} />
    </InstantSearch>
  )
}
