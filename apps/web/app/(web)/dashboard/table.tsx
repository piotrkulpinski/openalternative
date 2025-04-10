"use client"

import { formatDate } from "@curiousleaf/utils"
import { type Tool, ToolStatus } from "@openalternative/db/client"
import type { ColumnDef } from "@tanstack/react-table"
import { differenceInDays, formatDistanceToNowStrict } from "date-fns"
import { useQueryStates } from "nuqs"
import { use, useMemo } from "react"
import { Button } from "~/components/common/button"
import { Icon } from "~/components/common/icon"
import { Link } from "~/components/common/link"
import { Stack } from "~/components/common/stack"
import { DataTable } from "~/components/data-table/data-table"
import { DataTableColumnHeader } from "~/components/data-table/data-table-column-header"
import { DataTableLink } from "~/components/data-table/data-table-link"
import { DataTableToolbar } from "~/components/data-table/data-table-toolbar"
import { VerifiedBadge } from "~/components/web/verified-badge"
import { useDataTable } from "~/hooks/use-data-table"
import type { findTools } from "~/server/admin/tools/queries"
import { toolsTableParamsSchema } from "~/server/admin/tools/schemas"
import type { DataTableFilterField } from "~/types"

type DashboardTableProps = {
  toolsPromise: ReturnType<typeof findTools>
}

export const DashboardTable = ({ toolsPromise }: DashboardTableProps) => {
  const { tools, pageCount } = use(toolsPromise)
  const [{ perPage, sort }] = useQueryStates(toolsTableParamsSchema)

  // Memoize the columns so they don't re-render on every render
  const columns = useMemo((): ColumnDef<Tool>[] => {
    return [
      {
        accessorKey: "name",
        enableHiding: false,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
        cell: ({ row }) => {
          const { name, slug, status, faviconUrl, ownerId } = row.original

          if (status === ToolStatus.Draft) {
            return <span className="text-muted-foreground font-medium">{name}</span>
          }

          return (
            <DataTableLink href={`/${slug}`} image={faviconUrl} title={name}>
              {ownerId && <VerifiedBadge size="sm" />}
            </DataTableLink>
          )
        },
      },
      {
        accessorKey: "publishedAt",
        enableHiding: false,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Published At" />,
        cell: ({ row }) => {
          const { status, publishedAt } = row.original

          switch (status) {
            case ToolStatus.Published:
              return (
                <Stack size="sm" wrap={false}>
                  <Icon
                    name="lucide/circle"
                    className="stroke-3 text-green-600/75 dark:text-green-500/75"
                  />
                  <span className="text-muted-foreground font-medium">
                    {formatDate(publishedAt!)}
                  </span>
                </Stack>
              )
            case ToolStatus.Scheduled:
              return (
                <Stack size="sm" wrap={false} title={formatDate(publishedAt!)}>
                  <Icon
                    name="lucide/circle-dot-dashed"
                    className="stroke-3 text-yellow-700/75 dark:text-yellow-500/75"
                  />
                  <span className="text-muted-foreground font-medium">
                    Scheduled{" "}
                    {formatDistanceToNowStrict(publishedAt!, {
                      unit: "day",
                      roundingMethod: "ceil",
                      addSuffix: true,
                    })}
                  </span>
                </Stack>
              )
            case ToolStatus.Draft:
              return (
                <Stack size="sm" wrap={false}>
                  <Icon name="lucide/circle-dashed" className="stroke-3 text-muted-foreground/75" />
                  <span className="text-muted-foreground/75">Awaiting review</span>
                </Stack>
              )
            default:
              return ""
          }
        },
      },
      {
        accessorKey: "pageviews",
        enableHiding: false,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Views (last 30d)" />,
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.getValue<number>("pageviews")?.toLocaleString()}
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        enableHiding: false,
        header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {formatDate(row.getValue<Date>("createdAt"))}
          </span>
        ),
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const { slug, isFeatured, publishedAt } = row.original
          const isLongQueue = !publishedAt || differenceInDays(publishedAt, new Date()) >= 7

          return (
            <Stack size="sm" className="float-right -my-1">
              {isLongQueue && (
                <Button size="sm" variant="secondary" asChild>
                  <Link href={`/submit/${slug}`}>Expedite</Link>
                </Button>
              )}

              {!isFeatured && (
                <Button
                  size="sm"
                  variant="secondary"
                  prefix={<Icon name="lucide/sparkles" className="text-inherit" />}
                  className="text-blue-600 dark:text-blue-400"
                  asChild
                >
                  <Link href={`/submit/${slug}`}>Promote</Link>
                </Button>
              )}
            </Stack>
          )
        },
      },
    ]
  }, [])

  // Search filters
  const filterFields: DataTableFilterField<Tool>[] = [
    {
      id: "name",
      label: "Name",
      placeholder: "Search by name...",
    },
  ]

  const { table } = useDataTable({
    data: tools,
    columns,
    pageCount,
    filterFields,
    shallow: false,
    clearOnDefault: true,
    initialState: {
      pagination: { pageIndex: 0, pageSize: perPage },
      sorting: sort,
      columnPinning: { right: ["actions"] },
      columnVisibility: { createdAt: false },
    },
    getRowId: originalRow => originalRow.slug,
  })

  return (
    <DataTable table={table} emptyState="No tools found. Submit or claim a tool to get started.">
      <DataTableToolbar table={table} filterFields={filterFields}>
        <Button size="md" variant="primary" prefix={<Icon name="lucide/plus" />} asChild>
          <Link href="/submit">Submit a tool</Link>
        </Button>
      </DataTableToolbar>
    </DataTable>
  )
}
