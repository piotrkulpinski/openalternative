"use client"

import type { Tool } from "@openalternative/db"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { ToolRow } from "~/app/(dashboard)/ToolRow"
import { Button } from "~/components/Button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/Card"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "~/components/Table"

type ToolsTableProps = {
  tools: Tool[]
  offset: number
  totalTools: number
}

export function ToolsTable({ tools, offset, totalTools }: ToolsTableProps) {
  const router = useRouter()
  const toolsPerPage = 10

  function prevPage() {
    router.back()
  }

  function nextPage() {
    router.push(`/?offset=${offset}`, { scroll: false })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tools</CardTitle>
        <CardDescription>Manage your tools and view their sales performance.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Price</TableHead>
              <TableHead className="hidden md:table-cell">Total Sales</TableHead>
              <TableHead className="hidden md:table-cell">Created at</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tools.map(tool => (
              <ToolRow key={tool.id} tool={tool} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <form className="flex items-center w-full justify-between">
          <div className="text-xs text-muted-foreground">
            Showing{" "}
            <strong>
              {Math.min(offset - toolsPerPage, totalTools) + 1}-{offset}
            </strong>{" "}
            of <strong>{totalTools}</strong> tools
          </div>
          <div className="flex">
            <Button
              formAction={prevPage}
              variant="ghost"
              size="sm"
              type="submit"
              disabled={offset === toolsPerPage}
            >
              <ChevronLeft className="mr-2 size-4" />
              Prev
            </Button>

            <Button
              formAction={nextPage}
              variant="ghost"
              size="sm"
              type="submit"
              disabled={offset + toolsPerPage > totalTools}
            >
              Next
              <ChevronRight className="ml-2 size-4" />
            </Button>
          </div>
        </form>
      </CardFooter>
    </Card>
  )
}
