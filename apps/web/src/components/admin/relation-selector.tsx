import { MousePointerClickIcon } from "lucide-react"
import { use } from "react"
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

type Relation = {
  id: string
  name: string
}

type RelationSelectorProps = {
  promise: Promise<Relation[]>
  selectedIds: string[]
  maxSelected?: number
  onChange: (selectedIds: string[]) => void
}

export const RelationSelector = ({ promise, selectedIds, onChange }: RelationSelectorProps) => {
  const relations = use(promise)
  const selectedRelations = relations?.filter(rel => selectedIds.includes(rel.id))

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          size="md"
          className="justify-start w-full px-3 gap-2.5"
          prefix={<MousePointerClickIcon />}
          suffix={
            <Badge variant="outline" className="ml-auto size-auto">
              {selectedRelations.length}
            </Badge>
          }
        >
          <Separator orientation="vertical" />

          <Stack size="xs">
            {selectedRelations.length === 0 && (
              <span className="font-normal text-muted-foreground">Select</span>
            )}

            {selectedRelations.map(relation => (
              <Badge key={relation.id}>{relation.name}</Badge>
            ))}
          </Stack>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0" align="start">
        <Command>
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

          {selectedIds.length > 0 && (
            <div className="p-1 border-t">
              <Button variant="ghost" onClick={() => onChange([])} className="w-full">
                Clear selection
              </Button>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
