"use client"

import type { Alternative, Category, License, Tool } from "@openalternative/db"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { searchItems } from "~/actions/search"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command"
import { useDebouncedState } from "~/hooks/use-debounced-state"

type SearchResult = {
  tools: Tool[]
  alternatives: Alternative[]
  categories: Category[]
  licenses: License[]
}

export const CommandMenu = () => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useDebouncedState("", 250)
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(open => {
          if (!open) {
            return true
          }

          // Clear search results
          clearSearch()
          return false
        })
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.length > 1) {
        const results = await searchItems(searchQuery)
        setSearchResults(results)
      } else {
        setSearchResults(null)
      }
    }

    performSearch()
  }, [searchQuery])

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)

    // Clear search results
    !newOpen && clearSearch()
  }

  const handleSearch = (value: string) => {
    setSearchQuery(value)
  }

  const handleSelectItem = (item: any, type: string) => {
    handleOpenChange(false)
    router.push(`/${type}/${item.id}`)
  }

  const clearSearch = () => {
    setTimeout(() => {
      setSearchResults(null)
      setSearchQuery("")
    }, 250)
  }

  return (
    <CommandDialog open={open} onOpenChange={handleOpenChange}>
      <CommandInput placeholder="Type to search..." onValueChange={handleSearch} />

      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {!!searchResults?.tools.length && (
          <CommandGroup heading="Tools">
            {searchResults.tools.map(tool => (
              <CommandItem key={tool.id} onSelect={() => handleSelectItem(tool, "tools")}>
                {tool.name}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {!!searchResults?.alternatives.length && (
          <CommandGroup heading="Alternatives">
            {searchResults.alternatives.map(alternative => (
              <CommandItem
                key={alternative.id}
                onSelect={() => handleSelectItem(alternative, "alternatives")}
              >
                {alternative.name}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {!!searchResults?.categories.length && (
          <CommandGroup heading="Categories">
            {searchResults.categories.map(category => (
              <CommandItem
                key={category.id}
                onSelect={() => handleSelectItem(category, "categories")}
              >
                {category.name}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {!!searchResults?.licenses.length && (
          <CommandGroup heading="Licenses">
            {searchResults.licenses.map(license => (
              <CommandItem key={license.id} onSelect={() => handleSelectItem(license, "licenses")}>
                {license.name}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  )
}
