"use client"

import { getUrlHostname } from "@curiousleaf/utils"
import { type HotkeyItem, useDebouncedState, useHotkeys } from "@mantine/hooks"
import { capitalCase } from "change-case"
import { usePathname, useRouter } from "next/navigation"
import { posthog } from "posthog-js"
import { type ReactNode, useEffect, useRef, useState } from "react"
import type { inferServerActionReturnData } from "zsa"
import { useServerAction } from "zsa-react"
import {
  type AlternativeSearchResult,
  type CategorySearchResult,
  type SearchResult,
  type ToolSearchResult,
  searchItems,
} from "~/actions/search"
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

type CommandSection = {
  name: string
  items: {
    label: string
    path: string
    shortcut?: boolean
  }[]
}

export const Search = () => {
  const router = useRouter()
  const pathname = usePathname()
  const search = useSearch()
  const [results, setResults] = useState<inferServerActionReturnData<typeof searchItems>>()
  const [query, setQuery] = useDebouncedState("", 250)
  const listRef = useRef<HTMLDivElement>(null)
  const isAdmin = pathname.startsWith("/admin")
  const hasQuery = !!query.length

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
      listRef.current?.scrollTo({ top: 0, behavior: "smooth" })
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
        posthog.capture("search", { query })
      } else {
        setResults(undefined)
      }
    }

    performSearch()
  }, [query, execute])

  const isToolResult = (result: SearchResult): result is ToolSearchResult => {
    return result._federation.indexUid === "tools"
  }

  const isAlternativeResult = (result: SearchResult): result is AlternativeSearchResult => {
    return result._federation.indexUid === "alternatives"
  }

  const isCategoryResult = (result: SearchResult): result is CategorySearchResult => {
    return result._federation.indexUid === "categories"
  }

  const getHref = (result: SearchResult) => {
    if (isToolResult(result)) {
      return `${isAdmin ? "/admin/tools" : ""}/${result.slug}`
    }

    if (isAlternativeResult(result)) {
      return `${isAdmin ? "/admin" : ""}/alternatives/${result.slug}`
    }

    if (isCategoryResult(result)) {
      return `${isAdmin ? "/admin" : ""}/categories/${result.fullPath}`
    }

    return ""
  }

  const renderItemDisplay = (result: SearchResult): ReactNode => {
    if (isToolResult(result)) {
      return (
        <>
          {result.faviconUrl && <img src={result.faviconUrl} alt="" width={16} height={16} />}
          <span className="flex-1 truncate">{result.name}</span>
          <span className="opacity-50">{getUrlHostname(result.websiteUrl || "")}</span>
        </>
      )
    }

    if (isAlternativeResult(result)) {
      return (
        <>
          {result.faviconUrl && <img src={result.faviconUrl} alt="" width={16} height={16} />}
          <span className="flex-1 truncate">{result.name}</span>
        </>
      )
    }

    if (isCategoryResult(result)) {
      return (
        <>
          <span className="flex-1 truncate">{result.name}</span>
        </>
      )
    }

    return null
  }

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

        {hasQuery &&
          Object.entries(results || {}).map(([key, items]) => (
            <CommandGroup key={key} heading={capitalCase(key)}>
              {items.map(result => (
                <CommandItem
                  key={result.slug}
                  value={`${key}:${result.slug}`}
                  onSelect={() => navigateTo(getHref(result))}
                >
                  {renderItemDisplay(result)}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
      </CommandList>
    </CommandDialog>
  )
}
