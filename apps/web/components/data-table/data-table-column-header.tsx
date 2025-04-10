import type { Column } from "@tanstack/react-table"
import type { ComponentProps } from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/common/dropdown-menu"
import { cx } from "~/utils/cva"
import { Icon } from "../common/icon"

type DataTableColumnHeaderProps<TData, TValue> = ComponentProps<"div"> & {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort() && !column.getCanHide()) {
    return <div className={cx(className)}>{title}</div>
  }

  const buttonLabel =
    column.getCanSort() && column.getIsSorted() === "desc"
      ? "Sorted descending. Click to sort ascending."
      : column.getIsSorted() === "asc"
        ? "Sorted ascending. Click to sort descending."
        : "Not sorted. Click to sort ascending."

  const buttonSuffix =
    column.getCanSort() && column.getIsSorted() === "desc" ? (
      <Icon name="lucide/arrow-down" />
    ) : column.getIsSorted() === "asc" ? (
      <Icon name="lucide/arrow-up" />
    ) : (
      <Icon name="lucide/chevrons-up-down" />
    )

  return (
    <div className={cx("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex items-center gap-1 text-muted-foreground/70 whitespace-nowrap rounded-md hover:text-foreground data-[state=open]:text-foreground"
          aria-label={buttonLabel}
        >
          {title}
          {buttonSuffix}
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start">
          {column.getCanSort() && (
            <>
              <DropdownMenuItem
                aria-label="Sort ascending"
                onClick={() => column.toggleSorting(false)}
              >
                <Icon
                  name="lucide/arrow-up"
                  className="mr-2 text-muted-foreground/70"
                  aria-hidden="true"
                />
                Asc
              </DropdownMenuItem>

              <DropdownMenuItem
                aria-label="Sort descending"
                onClick={() => column.toggleSorting(true)}
              >
                <Icon
                  name="lucide/arrow-down"
                  className="mr-2 text-muted-foreground/70"
                  aria-hidden="true"
                />
                Desc
              </DropdownMenuItem>
            </>
          )}
          {column.getCanSort() && column.getCanHide() && <DropdownMenuSeparator />}
          {column.getCanHide() && (
            <DropdownMenuItem
              aria-label="Hide column"
              onClick={() => column.toggleVisibility(false)}
            >
              <Icon
                name="lucide/eye-off"
                className="mr-2 text-muted-foreground/70"
                aria-hidden="true"
              />
              Hide
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
