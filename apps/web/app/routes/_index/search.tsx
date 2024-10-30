import { history } from "instantsearch.js/es/lib/routers"
import { type ComponentProps, useRef } from "react"
import {
  Configure,
  InstantSearch,
  InstantSearchSSRProvider,
  type InstantSearchServerState,
} from "react-instantsearch"
import { ClientOnly } from "remix-utils/client-only"
import { Input } from "~/components/ui/forms/input"
import { searchClient } from "~/services.server/algolia"
import type { SponsoringOne } from "~/services.server/api"
import { Filters } from "./filters"
import { Listing } from "./listing"
import { Pagination } from "./pagination"

type SearchProps = {
  serverState?: InstantSearchServerState
  url: URL | string
  sponsoring: SponsoringOne | null
}

export const Search = ({ serverState, url, sponsoring }: SearchProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const indexName = import.meta.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME ?? ""

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
    <InstantSearchSSRProvider {...serverState}>
      <InstantSearch {...instantSearchOptions}>
        <Configure />

        <div ref={containerRef} className="flex flex-col gap-4 scroll-mt-16">
          <ClientOnly fallback={<Input disabled />}>{() => <Filters />}</ClientOnly>
          <Listing sponsoring={sponsoring} />
        </div>

        <Pagination containerRef={containerRef} padding={2} />
      </InstantSearch>
    </InstantSearchSSRProvider>
  )
}
