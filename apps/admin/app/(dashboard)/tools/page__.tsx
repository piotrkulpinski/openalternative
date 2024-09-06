import { PlusCircle } from "lucide-react"
import { ToolsTable } from "~/app/(dashboard)/ToolsTable"
import { Button } from "~/components/ui/Button"
import { CardDescription, CardTitle } from "~/components/ui/Card"
import { prisma } from "~/services/prisma"

type ToolPageProps = {
  searchParams: { q: string; offset: string }
}

export default async function ToolPage({ searchParams }: ToolPageProps) {
  const search = searchParams.q ?? ""
  const offset = Number(searchParams.offset ?? "0")
  const toolsPerPage = 25

  const [tools, totalTools] = await prisma.$transaction([
    prisma.tool.findMany({
      where: { name: { contains: search } },
      orderBy: { id: "desc" },
      take: toolsPerPage * 4,
      skip: offset,
    }),

    prisma.tool.count({
      where: { name: { contains: search } },
    }),
  ])

  return (
    <>
      <div className="flex items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <CardTitle>Tools</CardTitle>
          <CardDescription>Manage your tools and view their sales performance.</CardDescription>
        </div>

        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="size-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Product</span>
        </Button>
      </div>

      <ToolsTable
        tools={tools}
        offset={(offset ?? 0) + toolsPerPage}
        perPage={toolsPerPage}
        totalTools={totalTools}
      />
    </>
  )
}
