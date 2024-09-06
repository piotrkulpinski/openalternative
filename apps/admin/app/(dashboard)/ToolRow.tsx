import type { Tool } from "@openalternative/db"
import { MoreHorizontal } from "lucide-react"
import Image from "next/image"
import { format } from "timeago.js"
import { Badge } from "~/components/ui/Badge"
import { Button } from "~/components/ui/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/DropdownMenu"
import { TableCell, TableRow } from "~/components/ui/Table"
import { cx } from "~/utils/cva"
import { deleteProduct } from "./actions"

type ToolProps = {
  tool: Tool
}

export function ToolRow({ tool }: ToolProps) {
  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        {tool.faviconUrl && (
          <Image
            src={tool.faviconUrl}
            alt="Product image"
            height="64"
            width="64"
            className="size-8 aspect-square rounded object-cover"
          />
        )}
      </TableCell>
      <TableCell className="font-medium">{tool.name}</TableCell>
      <TableCell>
        <Badge variant="outline" className={cx(tool.publishedAt && "bg-green-50")}>
          {tool.publishedAt ? "Published" : "Draft"}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell max-w-96 truncate">{tool.tagline}</TableCell>
      <TableCell className="hidden md:table-cell">{tool.stars}</TableCell>
      <TableCell className="hidden md:table-cell">
        {tool.publishedAt ? format(tool.publishedAt) : "-"}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost" className="-my-1">
              <MoreHorizontal className="size-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>
              <form action={deleteProduct}>
                <button type="submit">Delete</button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
