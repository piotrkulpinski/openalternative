"use client"

import { getUrlHostname } from "@curiousleaf/utils"
import { type HotkeyItem, useDebouncedState, useHotkeys } from "@mantine/hooks"
import type { Alternative, Category, Tool } from "@prisma/client"
import { usePathname, useRouter } from "next/navigation"
import { type ReactNode, useEffect, useState } from "react"
import { useServerAction } from "zsa-react"
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

type SearchResult = {
  tools: Tool[]
  alternatives: Alternative[]
  categories: Category[]
}

type SearchResultsProps<T> = {
  name: string
  items: T[] | undefined
  onItemSelect: (url: string) => void
  getHref: (item: T) => string
  renderItemDisplay: (item: T) => ReactNode
}

type CommandSection = {
  name: string
  items: {
    label: string
    path: string
    shortcut?: boolean
  }[]
}

const SearchResults = <T extends { slug: string; name: string }>({
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

export const Search = () => {
  const router = useRouter()
  const pathname = usePathname()
  const search = useSearch()
  const [results, setResults] = useState<SearchResult | null>(null)
  const [query, setQuery] = useDebouncedState("", 250)
  const isAdmin = pathname.startsWith("/admin")
  const hasQuery = !!query.length

  const clearSearch = () => {
    setTimeout(() => {
      setResults(null)
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
      name: "Browse",
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
    },

    onError: ({ err }) => {
      console.error(err)
      setResults(null)
    },
  })

  useEffect(() => {
    const performSearch = async () => {
      if (hasQuery) {
        execute({ query })
      } else {
        setResults(null)
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

      {hasQuery && <CommandEmpty>No results found.</CommandEmpty>}

      <CommandList>
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

        <SearchResults
          name="Tools"
          items={results?.tools}
          onItemSelect={navigateTo}
          getHref={({ slug }) => `${isAdmin ? "/admin/tools" : ""}/${slug}`}
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
          items={results?.alternatives}
          onItemSelect={navigateTo}
          getHref={({ slug }) => `${isAdmin ? "/admin/alternatives" : ""}/alternatives/${slug}`}
          renderItemDisplay={({ name, faviconUrl }) => (
            <>
              {faviconUrl && <img src={faviconUrl} alt="" width={16} height={16} />}
              <span className="flex-1 truncate">{name}</span>
            </>
          )}
        />

        <SearchResults
          name="Categories"
          items={results?.categories}
          onItemSelect={navigateTo}
          getHref={({ slug }) => `${isAdmin ? "/admin" : ""}/categories/${slug}`}
          renderItemDisplay={({ name }) => name}
        />
      </CommandList>
    </CommandDialog>
  )
}
