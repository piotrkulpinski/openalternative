import { Input } from "apps/web/app/components/forms/Input"
import { searchClient } from "apps/web/app/services.server/algolia"
import type { SponsoringOne } from "apps/web/app/services.server/api"
import { history } from "instantsearch.js/es/lib/routers"
import { type ComponentProps, useRef } from "react"
import { Configure, InstantSearch } from "react-instantsearch"
import { ClientOnly } from "remix-utils/client-only"
import { Filters } from "./Filters"
import { Listing } from "./Listing"
import { Pagination } from "./Pagination"

type SearchProps = {
  url: URL | string
  sponsoring: SponsoringOne | null
}

export const Search = ({ url, sponsoring }: SearchProps) => {
  const listingRef = useRef<HTMLDivElement>(null)
  const indexName = import.meta.env.VITE_ALGOLIA_INDEX_NAME ?? ""

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

      <div ref={listingRef} className="flex flex-col gap-4 scroll-mt-14">
        <ClientOnly fallback={<Input disabled />}>{() => <Filters />}</ClientOnly>
        <Listing sponsoring={sponsoring} />
      </div>

      <Pagination listingRef={listingRef} padding={2} />
    </InstantSearch>
  )
}
