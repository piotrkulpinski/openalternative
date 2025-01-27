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
import { Badge } from "~/components/web/ui/badge"
import type { searchConfig } from "~/config/search"
import { useToolFilters } from "~/hooks/use-tool-filters"
import type { FilterOption } from "~/server/web/tools/actions"
import { cx } from "~/utils/cva"

type ToolRefinementProps = Omit<ComponentProps<typeof Command>, "filter"> & {
  filter: (typeof searchConfig.filters)[number]
  items: FilterOption[]
  isPending?: boolean
}

export const ToolRefinement = ({
  filter,
  items,
  isPending,
  className,
  ...props
}: ToolRefinementProps) => {
  const { filters, updateFilters } = useToolFilters()

  return (
    <Command
      filter={(value, search) => (value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0)}
      className={cx("size-full border rounded-md", className)}
      {...props}
    >
      <CommandInput
        placeholder={`Search ${filter}`}
        className="w-full !text-xs !min-w-[0] px-3 py-2 font-normal border-b outline-none"
      />

      <CommandList className="flex flex-col p-2 max-h-60 overflow-auto">
        <CommandGroup>
          <CommandItem value="-" className="hidden" />

          {items.map((item: FilterOption) => (
            <CommandItem
              key={item.slug}
              value={item.slug}
              onSelect={(value: string) => {
                const currentValues = filters[filter] as string[]
                const newValues = currentValues.includes(value)
                  ? currentValues.filter(v => v !== value)
                  : [...currentValues, value]

                updateFilters({ [filter]: newValues })
              }}
              className="flex items-center gap-2.5 select-none text-[13px] cursor-pointer text-secondary py-1 px-2 -mx-1 rounded-sm data-[selected=true]:bg-card-dark data-[selected=true]:text-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
            >
              <input
                type="checkbox"
                checked={(filters[filter] as string[]).includes(item.slug)}
                readOnly
                className="pointer-events-none"
              />
              <span className="flex-1 truncate">{item.name}</span>
              <Badge size="sm">{item.count}</Badge>
            </CommandItem>
          ))}
        </CommandGroup>

        {!isPending && (
          <CommandEmpty className="px-1 text-sm text-muted">No results found.</CommandEmpty>
        )}

        {isPending && (
          <CommandLoading className="px-1 text-sm text-muted">Loading...</CommandLoading>
        )}
      </CommandList>
    </Command>
  )
}
