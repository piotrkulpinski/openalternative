import { MousePointerClickIcon } from "lucide-react"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Checkbox } from "~/components/ui/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { Separator } from "~/components/ui/separator"

type Relation = {
  id: string
  name: string
}

type RelationSelectorProps = {
  relations: Relation[]
  selectedIds: string[]
  maxSelected?: number
  onChange: (selectedIds: string[]) => void
}

export const RelationSelector = ({ relations, selectedIds, onChange }: RelationSelectorProps) => {
  const selectedRelations = relations.filter(rel => selectedIds.includes(rel.id))

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="justify-start w-full px-3 gap-2.5"
          prefix={<MousePointerClickIcon />}
          suffix={
            <Badge variant="outline" className="ml-auto px-1.5 size-auto">
              {selectedRelations.length}
            </Badge>
          }
        >
          <Separator orientation="vertical" />

          <div className="relative flex-1 flex items-center gap-1 overflow-hidden">
            {selectedRelations.length === 0 && (
              <span className="font-normal text-muted-foreground">Select</span>
            )}

            {selectedRelations.map(relation => (
              <Badge key={relation.id} variant="secondary" className="px-1.5">
                {relation.name}
              </Badge>
            ))}
          </div>
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
                    <Checkbox checked={isSelected} />
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
