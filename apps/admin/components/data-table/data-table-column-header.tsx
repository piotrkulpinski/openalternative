import type { Column } from "@tanstack/react-table"
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon, EyeOffIcon } from "lucide-react"

import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { cx } from "~/utils/cva"

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
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
      <ArrowDownIcon />
    ) : column.getIsSorted() === "asc" ? (
      <ArrowUpIcon />
    ) : (
      <ChevronsUpDownIcon />
    )

  return (
    <div className={cx("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-1.5 px-1.5 py-1 h-auto data-[state=open]:bg-accent"
            suffix={buttonSuffix}
            aria-label={buttonLabel}
          >
            {title}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start">
          {column.getCanSort() && (
            <>
              <DropdownMenuItem
                aria-label="Sort ascending"
                onClick={() => column.toggleSorting(false)}
              >
                <ArrowUpIcon className="mr-2 text-muted-foreground/70" aria-hidden="true" />
                Asc
              </DropdownMenuItem>

              <DropdownMenuItem
                aria-label="Sort descending"
                onClick={() => column.toggleSorting(true)}
              >
                <ArrowDownIcon className="mr-2 text-muted-foreground/70" aria-hidden="true" />
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
              <EyeOffIcon className="mr-2 text-muted-foreground/70" aria-hidden="true" />
              Hide
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
