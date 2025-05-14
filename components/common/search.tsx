"use client"

import { getUrlHostname } from "@curiousleaf/utils"
import { type HotkeyItem, useDebouncedState, useHotkeys } from "@mantine/hooks"
import { usePathname, useRouter } from "next/navigation"
import { posthog } from "posthog-js"
import { useEffect, useRef, useState } from "react"
import type { inferServerActionReturnData } from "zsa"
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
  const [query, setQuery] = useDebouncedState("", 500)
  const listRef = useRef<HTMLDivElement>(null)

  const [tools, alternatives, categories] = results || []
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

        {!!tools?.hits.length && (
          <CommandGroup heading="Tools">
            {tools.hits.map(({ slug, name, faviconUrl, websiteUrl }) => (
              <CommandItem
                key={slug}
                value={`tools:${slug}`}
                onSelect={() => navigateTo(`${isAdmin ? "/admin/tools" : ""}/${slug}`)}
              >
                <>
                  {faviconUrl && <img src={faviconUrl} alt="" width={16} height={16} />}
                  <span className="flex-1 truncate">{name}</span>
                  <span className="opacity-50">{getUrlHostname(websiteUrl || "")}</span>
                </>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {!!alternatives?.hits.length && (
          <CommandGroup heading="Alternatives">
            {alternatives.hits.map(({ slug, name, faviconUrl }) => (
              <CommandItem
                key={slug}
                value={`alternatives:${slug}`}
                onSelect={() => navigateTo(`${isAdmin ? "/admin" : ""}/alternatives/${slug}`)}
              >
                <>
                  {faviconUrl && <img src={faviconUrl} alt="" width={16} height={16} />}
                  <span className="flex-1 truncate">{name}</span>
                </>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {!!categories?.hits.length && (
          <CommandGroup heading="Categories">
            {categories.hits.map(({ slug, name, fullPath }) => (
              <CommandItem
                key={slug}
                value={`categories:${slug}`}
                onSelect={() => navigateTo(`${isAdmin ? "/admin" : ""}/categories/${fullPath}`)}
              >
                <span className="flex-1 truncate">{name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>

      {!!results?.length && (
        <div className="px-3 py-2 text-[10px] text-muted-foreground/50 not-first:border-t">
          Search took {Math.max(...results.map(r => r.processingTimeMs))}ms
        </div>
      )}
    </CommandDialog>
  )
}
