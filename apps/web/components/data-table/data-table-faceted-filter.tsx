import type { Column } from "@tanstack/react-table"
import { Slot } from "radix-ui"
import { Badge } from "~/components/common/badge"
import { Button } from "~/components/common/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "~/components/common/command"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/common/popover"
import { Separator } from "~/components/common/separator"
import type { Option } from "~/types"
import { Icon } from "../common/icon"

type DataTableFacetedFilterProps<TData, TValue> = {
  column?: Column<TData, TValue>
  title?: string
  options: Option[]
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const selectedValues = new Set(column?.getFilterValue() as string[])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          size="md"
          className="border-dashed"
          prefix={<Icon name="lucide/circle-plus" />}
        >
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-0.5 h-3.5" />

              <Badge className="-my-1 rounded lg:hidden">{selectedValues.size}</Badge>

              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge className="-my-1 rounded">{selectedValues.size} selected</Badge>
                ) : (
                  options
                    .filter(option => selectedValues.has(option.value))
                    .map(option => (
                      <Badge key={option.value} className="-my-1 rounded">
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map(option => {
                const isSelected = selectedValues.has(option.value)

                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value)
                      } else {
                        selectedValues.add(option.value)
                      }
                      const filterValues = Array.from(selectedValues)
                      column?.setFilterValue(filterValues.length ? filterValues : undefined)
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="pointer-events-none"
                    />

                    <Slot.Root className="size-4 text-muted-foreground" aria-hidden="true">
                      {option.icon}
                    </Slot.Root>

                    <span>{option.label}</span>

                    {option.withCount && column?.getFacetedUniqueValues()?.get(option.value) && (
                      <span className="ml-auto flex items-center justify-center font-mono text-xs">
                        {column?.getFacetedUniqueValues().get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                )
              })}
            </CommandGroup>

            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    Clear filters
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
