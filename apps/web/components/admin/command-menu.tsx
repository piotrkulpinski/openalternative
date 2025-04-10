import { getUrlHostname } from "@curiousleaf/utils"
import { useDebouncedState } from "@mantine/hooks"
import type { Alternative, Category, Tool } from "@openalternative/db/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"
import { fetchRepositoryData } from "~/actions/misc"
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
import { Icon } from "../common/icon"

type SearchResult = {
  tools: Tool[]
  alternatives: Alternative[]
  categories: Category[]
}

type CommandMenuProps = {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export const CommandMenu = ({ isOpen, onOpenChange }: CommandMenuProps) => {
  const router = useRouter()
  const [query, setQuery] = useDebouncedState("", 100)
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null)

  const { execute: search, isPending: isSearching } = useServerAction(searchItems, {
    onSuccess: ({ data }) => {
      setSearchResults(data)
    },

    onError: ({ err }) => {
      console.error(err)
      setSearchResults(null)
    },
  })

  // Update tool
  const { execute: fetch, isPending: isFetching } = useServerAction(fetchRepositoryData, {
    onSuccess: ({ data }) => {
      toast.success("Repository data fetched")
    },

    onError: ({ err }) => {
      toast.error(err.message)
    },
  })

  useEffect(() => {
    const performSearch = async () => {
      if (query.length > 1) {
        search({ query })
      } else {
        setSearchResults(null)
      }
    }

    performSearch()
  }, [query])

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen)

    // Clear search results
    !newOpen && clearSearch()
  }

  const handleSelect = (url: string) => {
    handleOpenChange(false)
    router.push(url)
  }

  const clearSearch = () => {
    setTimeout(() => {
      setSearchResults(null)
      setQuery("")
    }, 250)
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={handleOpenChange}>
      <CommandInput placeholder="Type to search..." onValueChange={setQuery} />

      {isSearching && (
        <div className="absolute top-4 left-3 bg-background text-muted-foreground">
          <Icon name="lucide/loader" className="animate-spin" />
        </div>
      )}

      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Create">
          <CommandItem onSelect={() => handleSelect("/admin/tools/new")}>
            New Tool
            <CommandShortcut meta>1</CommandShortcut>
          </CommandItem>

          <CommandItem onSelect={() => handleSelect("/admin/alternatives/new")}>
            New Alternative
            <CommandShortcut meta>2</CommandShortcut>
          </CommandItem>

          <CommandItem onSelect={() => handleSelect("/admin/categories/new")}>
            New Category
            <CommandShortcut meta>3</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Quick Commands">
          <CommandItem onSelect={() => fetch()} disabled={isFetching}>
            Fetch Repository Data
          </CommandItem>
        </CommandGroup>

        {!!searchResults?.tools.length && (
          <CommandGroup heading="Tools">
            {searchResults.tools.map(tool => (
              <CommandItem
                key={tool.id}
                value={`tool:${tool.slug}`}
                onSelect={() => handleSelect(`/admin/tools/${tool.slug}`)}
                className="justify-between"
              >
                {tool.name} <span className="opacity-50">{getUrlHostname(tool.websiteUrl)}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {!!searchResults?.alternatives.length && (
          <CommandGroup heading="Alternatives">
            {searchResults.alternatives.map(alternative => (
              <CommandItem
                key={alternative.id}
                value={`alternative:${alternative.slug}`}
                onSelect={() => handleSelect(`/admin/alternatives/${alternative.slug}`)}
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
                value={`category:${category.slug}`}
                onSelect={() => handleSelect(`/admin/categories/${category.slug}`)}
              >
                {category.name}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  )
}
