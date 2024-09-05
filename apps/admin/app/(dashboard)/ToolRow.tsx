import { formatDate } from "@curiousleaf/utils"
import type { Tool } from "@openalternative/db"
import { MoreHorizontal } from "lucide-react"
import Image from "next/image"
import { Badge } from "~/components/Badge"
import { Button } from "~/components/Button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/DropdownMenu"
import { TableCell, TableRow } from "~/components/Table"
import { deleteProduct } from "./actions"

type ToolProps = {
  tool: Tool
}

export function ToolRow({ tool }: ToolProps) {
  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <Image
          src={tool.faviconUrl ?? ""}
          alt="Product image"
          height="64"
          width="64"
          className="size-8 aspect-square rounded-md object-cover"
        />
      </TableCell>
      <TableCell className="font-medium">{tool.name}</TableCell>
      <TableCell>
        <Badge variant="outline" className="capitalize">
          {tool.publishedAt ? "Published" : "Draft"}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">{tool.tagline}</TableCell>
      <TableCell className="hidden md:table-cell">{tool.stars}</TableCell>
      <TableCell className="hidden md:table-cell">
        {tool.publishedAt ? formatDate(tool.publishedAt) : "-"}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
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
