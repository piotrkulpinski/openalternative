"use client"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from "cmdk"
import type { ComponentProps } from "react"
import { memo } from "react"
import { Badge } from "~/components/common/badge"
import { Note } from "~/components/common/note"
import { useFilters } from "~/contexts/filter-context"
import type { FilterOption, FilterType } from "~/types/search"
import { cx } from "~/utils/cva"

type ToolRefinementProps = Omit<ComponentProps<typeof Command>, "filter"> & {
  filter: FilterType
  items: FilterOption[]
  isPending?: boolean
  disabled?: boolean
  defaultValue?: string
}

const ToolRefinementComponent = ({
  filter,
  items,
  isPending,
  disabled,
  defaultValue,
  className,
  ...props
}: ToolRefinementProps) => {
  const { filters, updateFilters } = useFilters()
  const selectedValues = filters[filter]

  return (
    <Command
      filter={(value, search) => (value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0)}
      className={cx("size-full border rounded-md", className)}
      {...props}
    >
      <CommandInput
        placeholder={`Search ${filter}`}
        className="w-full !text-xs !min-w-[0] px-3 py-2 font-normal border-b outline-none disabled:opacity-50"
        disabled={disabled}
      />

      <CommandList className="flex flex-col p-2 max-h-60 overflow-auto">
        <CommandGroup>
          <CommandItem value="-" className="hidden" />

          {items.map((item: FilterOption) => (
            <CommandItem
              key={item.slug}
              value={item.slug}
              onSelect={() =>
                updateFilters({
                  [filter]: selectedValues.includes(item.slug)
                    ? selectedValues.filter(v => v !== item.slug)
                    : [...selectedValues, item.slug],
                })
              }
              className={cx(
                "flex items-center gap-2.5 select-none text-[13px] cursor-pointer text-secondary-foreground py-1 px-2 -mx-1 rounded-sm data-[selected=true]:bg-accent data-[selected=true]:text-foreground",
                disabled && "opacity-50 pointer-events-none",
                selectedValues.includes(item.slug) && "bg-accent text-foreground",
              )}
              disabled={disabled}
            >
              <input
                type="checkbox"
                checked={selectedValues.includes(item.slug)}
                readOnly
                className="pointer-events-none"
              />
              <span className="flex-1 truncate">{item.name}</span>
              <Badge size="sm">{item.count}</Badge>
            </CommandItem>
          ))}
        </CommandGroup>

        {!isPending && (
          <CommandEmpty className="px-1" asChild>
            <Note as="div">No results found.</Note>
          </CommandEmpty>
        )}

        {isPending && (
          <CommandLoading className="px-1" asChild>
            <Note as="div">Loading...</Note>
          </CommandLoading>
        )}
      </CommandList>
    </Command>
  )
}

export const ToolRefinement = memo(ToolRefinementComponent)
