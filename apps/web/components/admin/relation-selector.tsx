import { useCompletion } from "@ai-sdk/react"
import { isTruthy } from "@curiousleaf/utils"
import { use, useEffect, useState } from "react"
import { AnimatedContainer } from "~/components/common/animated-container"
import { Badge } from "~/components/common/badge"
import { Button } from "~/components/common/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/common/command"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/common/popover"
import { Separator } from "~/components/common/separator"
import { Stack } from "~/components/common/stack"
import { Tooltip } from "~/components/common/tooltip"
import { Icon } from "../common/icon"

type Relation = {
  id: string
  name: string
}

type RelationSelectorProps = {
  promise: Promise<Relation[]>
  selectedIds: string[]
  prompt?: string
  maxSuggestions?: number
  onChange: (selectedIds: string[]) => void
}

export const RelationSelector = ({
  promise,
  selectedIds,
  prompt,
  maxSuggestions = 5,
  onChange,
}: RelationSelectorProps) => {
  const relations = use(promise)
  const [suggestedRelations, setSuggestedRelations] = useState<Relation[]>([])
  const selectedRelations = relations?.filter(({ id }) => selectedIds.includes(id))

  const { complete } = useCompletion({
    api: "/api/ai/completion",

    onFinish: (_, completion) => {
      if (completion) {
        const cats = completion
          .split(",")
          .map(name => name.trim())
          .map(name => relations.find(c => c.name === name) || null)
          .filter((name, index, self) => self.indexOf(name) === index)
          .filter(isTruthy)
          .slice(0, maxSuggestions)

        setSuggestedRelations(cats)
      }
    },
  })

  useEffect(() => {
    if (prompt && !!relations.length && !selectedIds.length && !suggestedRelations.length) {
      complete(`${prompt}
        
        Only return the relation names in comma-separated format, and nothing else. If there are no relevant relations, return an empty string.
        Sort the relations by relevance to the link.
        Suggest only ${maxSuggestions} relations at most.

        Available relations: ${relations.map(({ name }) => name).join(", ")}
      `)
    }
  }, [prompt, selectedIds])

  const handleFilter = (value: string, search: string) => {
    const normalizedValue = value.toLowerCase()
    const normalizedSearch = search.toLowerCase()
    return normalizedValue.includes(normalizedSearch) ? 1 : 0
  }

  return (
    <Stack direction="column" className="w-full">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            size="md"
            className="justify-start w-full px-3 gap-2.5"
            prefix={<Icon name="lucide/mouse-pointer-click" />}
            suffix={
              <Badge variant="outline" className="ml-auto size-auto">
                {selectedRelations.length}
              </Badge>
            }
          >
            <Separator orientation="vertical" />

            <Stack size="xs">
              {!selectedRelations.length && (
                <span className="font-normal text-muted-foreground">Select</span>
              )}

              {selectedRelations.map(relation => (
                <Badge key={relation.id}>{relation.name}</Badge>
              ))}
            </Stack>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="p-0" align="start">
          <Command filter={handleFilter}>
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {relations.map(alt => {
                  const isSelected = selectedIds.includes(alt.id)

                  return (
                    <CommandItem
                      key={alt.id}
                      onSelect={() => {
                        const newSelected = isSelected
                          ? selectedIds.filter(id => id !== alt.id)
                          : [...selectedIds, alt.id]
                        onChange(newSelected)
                      }}
                      className="gap-2"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        className="pointer-events-none"
                      />
                      <span>{alt.name}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>

            {!!selectedIds.length && (
              <div className="p-1 border-t">
                <Button variant="ghost" onClick={() => onChange([])} className="w-full">
                  Clear selection
                </Button>
              </div>
            )}
          </Command>
        </PopoverContent>
      </Popover>

      <AnimatedContainer height transition={{ ease: "linear", duration: 0.1 }}>
        {!!suggestedRelations.length && (
          <Stack size="sm" className="items-start">
            <Tooltip tooltip="AI-suggested relations based on the content of the link. Click a suggested relation to add it.">
              <span className="mt-px text-xs text-muted-foreground">Suggested:</span>
            </Tooltip>

            <Stack size="xs" className="flex-1">
              {suggestedRelations.map(relation => (
                <Badge key={relation.id} size="sm" variant="warning" asChild>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(selectedIds.concat(relation.id))
                      setSuggestedRelations(rel => rel.filter(({ id }) => id !== relation.id))
                    }}
                  >
                    {relation.name}
                  </button>
                </Badge>
              ))}
            </Stack>
          </Stack>
        )}
      </AnimatedContainer>
    </Stack>
  )
}
