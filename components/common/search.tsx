"use client"

import { getUrlHostname } from "@curiousleaf/utils"
import { type HotkeyItem, useDebouncedState, useHotkeys } from "@mantine/hooks"
import { usePathname, useRouter } from "next/navigation"
import { posthog } from "posthog-js"
import { type ReactNode, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import type { inferServerActionReturnData } from "zsa"
import { useServerAction } from "zsa-react"
import { fetchRepositoryData, indexData } from "~/actions/misc"
import { searchItems } from "~/actions/search"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "~/components/common/command"
import { Icon } from "~/components/common/icon"
import { Kbd } from "~/components/common/kbd"
import { useSearch } from "~/contexts/search-context"
import { useSession } from "~/lib/auth-client"

type SearchResultsProps<T> = {
  name: string
  items: T[] | undefined
  onItemSelect: (url: string) => void
  getHref: (item: T) => string
  renderItemDisplay: (item: T) => ReactNode
}

const SearchResults = <T extends { slug: string }>({
  name,
  items,
  onItemSelect,
  getHref,
  renderItemDisplay,
}: SearchResultsProps<T>) => {
  if (!items?.length) return null

  return (
    <CommandGroup heading={name}>
      {items.map(item => (
        <CommandItem
          key={item.slug}
          value={`${name.toLowerCase()}:${item.slug}`}
          onSelect={() => onItemSelect(getHref(item))}
        >
          {renderItemDisplay(item)}
        </CommandItem>
      ))}
    </CommandGroup>
  )
}

type CommandSection = {
  name: string
  items: {
    label: string
    path: string
    shortcut?: boolean
  }[]
}

export const Search = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const search = useSearch()
  const [results, setResults] = useState<inferServerActionReturnData<typeof searchItems>>()
  const [query, setQuery] = useDebouncedState("", 500)
  const listRef = useRef<HTMLDivElement>(null)

  const [tools, alternatives, categories] = results || []
  const isAdmin = session?.user.role === "admin"
  const isAdminPath = pathname.startsWith("/admin")
  const hasQuery = !!query.length

  const actions = [
    {
      action: fetchRepositoryData,
      label: "Fetch Repository Data",
      successMessage: "Repository data fetched",
    },
    {
      action: indexData,
      label: "Index Data",
      successMessage: "Data indexed",
    },
  ] as const

  const adminActions = actions.map(({ label, action, successMessage }) => ({
    label,
    execute: useServerAction(action, {
      onSuccess: () => toast.success(successMessage),
      onError: ({ err }) => toast.error(err.message),
    }).execute,
  }))

  const clearSearch = () => {
    setTimeout(() => {
      setResults(undefined)
      setQuery("")
    }, 250)
  }

  const handleOpenChange = (open: boolean) => {
    open ? search.open() : search.close()
    if (!open) clearSearch()
  }

  const navigateTo = (path: string) => {
    router.push(path)
    handleOpenChange(false)
  }

  const commandSections: CommandSection[] = []
  const hotkeys: HotkeyItem[] = [["mod+K", () => search.open()]]

  // Admin command sections & hotkeys
  if (isAdmin) {
    commandSections.push({
      name: "Create",
      items: [
        {
          label: "New Tool",
          path: "/admin/tools/new",
          shortcut: true,
        },
        {
          label: "New Alternative",
          path: "/admin/alternatives/new",
          shortcut: true,
        },
        {
          label: "New Category",
          path: "/admin/categories/new",
          shortcut: true,
        },
      ],
    })

    for (const [i, { path, shortcut }] of commandSections[0].items.entries()) {
      shortcut && hotkeys.push([`mod+${i + 1}`, () => navigateTo(path)])
    }

    // User command sections & hotkeys
  } else {
    commandSections.push({
      name: "Quick Links",
      items: [
        { label: "Tools", path: "/" },
        { label: "Alternatives", path: "/alternatives" },
        { label: "Categories", path: "/categories" },
      ],
    })
  }

  useHotkeys(hotkeys, [], true)

  const { execute, isPending } = useServerAction(searchItems, {
    onSuccess: ({ data }) => {
      setResults(data)

      if (data.some(r => r.hits.length > 0)) {
        listRef.current?.scrollTo({ top: 0, behavior: "smooth" })
        query.length > 2 && posthog.capture("search", { query: query.toLowerCase() })
      }
    },

    onError: ({ err }) => {
      console.error(err)
      setResults(undefined)
    },
  })

  useEffect(() => {
    const performSearch = async () => {
      if (hasQuery) {
        execute({ query })
      } else {
        setResults(undefined)
      }
    }

    performSearch()
  }, [query, execute])

  return (
    <CommandDialog open={search.isOpen} onOpenChange={handleOpenChange} shouldFilter={false}>
      <CommandInput
        placeholder="Type to search..."
        onValueChange={setQuery}
        className="pr-10"
        prefix={isPending && <Icon name="lucide/loader" className="animate-spin" />}
        suffix={<Kbd meta>K</Kbd>}
      />

      {hasQuery && !isPending && (
        <CommandEmpty>No results found. Please try a different query.</CommandEmpty>
      )}

      <CommandList ref={listRef}>
        {!hasQuery &&
          commandSections.map(({ name, items }) => (
            <CommandGroup key={name} heading={name}>
              {items.map(({ path, label, shortcut }, i) => (
                <CommandItem key={path} onSelect={() => navigateTo(path)}>
                  {label}
                  {shortcut && <CommandShortcut meta>{i + 1}</CommandShortcut>}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}

        {!hasQuery && isAdmin && (
          <CommandGroup heading="Admin">
            {adminActions.map(({ label, execute }) => (
              <CommandItem key={label} onSelect={() => execute()}>
                {label}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <SearchResults
          name="Tools"
          items={tools?.hits}
          onItemSelect={navigateTo}
          getHref={({ slug }) => `${isAdminPath ? "/admin/tools" : ""}/${slug}`}
          renderItemDisplay={({ name, faviconUrl, websiteUrl }) => (
            <>
              {faviconUrl && <img src={faviconUrl} alt="" width={16} height={16} />}
              <span className="flex-1 truncate">{name}</span>
              <span className="opacity-50">{getUrlHostname(websiteUrl)}</span>
            </>
          )}
        />

        <SearchResults
          name="Alternatives"
          items={alternatives?.hits}
          onItemSelect={navigateTo}
          getHref={({ slug }) => `${isAdminPath ? "/admin" : ""}/alternatives/${slug}`}
          renderItemDisplay={({ name, faviconUrl }) => (
            <>
              {faviconUrl && <img src={faviconUrl} alt="" width={16} height={16} />}
              <span className="flex-1 truncate">{name}</span>
            </>
          )}
        />

        <SearchResults
          name="Categories"
          items={categories?.hits}
          onItemSelect={navigateTo}
          getHref={({ slug, fullPath }) =>
            isAdminPath ? `/admin/categories/${slug}` : `/categories/${fullPath}`
          }
          renderItemDisplay={({ name }) => name}
        />
      </CommandList>

      {!!results && (
        <div className="px-3 py-2 text-[10px] text-muted-foreground/50 not-first:border-t">
          Found {results.reduce((acc, curr) => acc + curr.estimatedTotalHits, 0)} results in{" "}
          {Math.max(...results.map(r => r.processingTimeMs))}ms
        </div>
      )}
    </CommandDialog>
  )
}
