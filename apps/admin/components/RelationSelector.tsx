import { MousePointerClickIcon } from "lucide-react"
import type * as React from "react"
import { Badge } from "~/components/ui/Badge"
import { Button } from "~/components/ui/Button"
import { Checkbox } from "~/components/ui/Checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "~/components/ui/Command"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/Popover"
import { ScrollArea } from "~/components/ui/ScrollArea"
import { Separator } from "~/components/ui/Separator"

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

export const RelationSelector: React.FC<RelationSelectorProps> = ({
  relations,
  selectedIds,
  maxSelected = 3,
  onChange,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="justify-start px-3 gap-2.5"
          prefix={<MousePointerClickIcon />}
        >
          <Separator orientation="vertical" />

          {!selectedIds.length && <span className="font-normal text-muted-foreground">Select</span>}

          <Badge variant="secondary" className="md:hidden">
            {selectedIds.length}
          </Badge>

          <div className="space-x-1.5 max-md:hidden">
            {selectedIds.length > maxSelected ? (
              <Badge variant="secondary" className="px-1.5">
                {selectedIds.length} selected
              </Badge>
            ) : (
              relations
                .filter(alt => selectedIds.includes(alt.id))
                .map(alt => (
                  <Badge key={alt.id} variant="secondary" className="px-1.5">
                    {alt.name}
                  </Badge>
                ))
            )}
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full min-w-52 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <ScrollArea className="h-72">
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
            </ScrollArea>
          </CommandList>

          {selectedIds.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup>
                <CommandItem onSelect={() => onChange([])} className="justify-center text-center">
                  Clear selection
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
