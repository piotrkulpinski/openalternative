import { PlusCircleIcon } from "lucide-react"
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
import { Separator } from "~/components/ui/Separator"

type Alternative = {
  id: string
  name: string
}

type AlternativesSelectorProps = {
  alternatives: Alternative[]
  selectedAlternatives: string[]
  onChange: (selectedIds: string[]) => void
}

export const AlternativesSelector: React.FC<AlternativesSelectorProps> = ({
  alternatives,
  selectedAlternatives,
  onChange,
}) => {
  console.log(selectedAlternatives)
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-dashed"
          prefix={<PlusCircleIcon />}
        >
          Alternatives
          {selectedAlternatives.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                {selectedAlternatives.length}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedAlternatives.length > 2 ? (
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {selectedAlternatives.length} selected
                  </Badge>
                ) : (
                  alternatives
                    .filter(alt => selectedAlternatives.includes(alt.id))
                    .map(alt => (
                      <Badge
                        variant="secondary"
                        key={alt.id}
                        className="rounded-sm px-1 font-normal"
                      >
                        {alt.name}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[12.5rem] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search alternatives..." />
          <CommandList>
            <CommandEmpty>No alternatives found.</CommandEmpty>
            <CommandGroup>
              {alternatives.map(alt => {
                const isSelected = selectedAlternatives.includes(alt.id)

                return (
                  <CommandItem
                    key={alt.id}
                    onSelect={() => {
                      const newSelected = isSelected
                        ? selectedAlternatives.filter(id => id !== alt.id)
                        : [...selectedAlternatives, alt.id]
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

            {selectedAlternatives.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem onSelect={() => onChange([])} className="justify-center text-center">
                    Clear alternatives
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
