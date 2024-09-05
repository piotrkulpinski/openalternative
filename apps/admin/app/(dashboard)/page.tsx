import { File, PlusCircle } from "lucide-react"
import { ToolsTable } from "~/app/(dashboard)/ToolsTable"
import { Button } from "~/components/Button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/Tabs"
import { prisma } from "~/services/prisma"

type ToolPageProps = {
  searchParams: { q: string; offset: string }
}

export default async function ToolPage({ searchParams }: ToolPageProps) {
  const search = searchParams.q ?? ""
  const offset = Number(searchParams.offset ?? "0")

  const [tools, totalTools] = await prisma.$transaction([
    prisma.tool.findMany({
      where: { name: { contains: search } },
      take: 10,
      skip: offset,
    }),

    prisma.tool.count({
      where: { name: { contains: search } },
    }),
  ])

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="archived" className="hidden sm:flex">
            Archived
          </TabsTrigger>
        </TabsList>
        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <File className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Export</span>
          </Button>
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Product</span>
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        <ToolsTable tools={tools} offset={(offset ?? 0) + 10} totalTools={totalTools} />
      </TabsContent>
    </Tabs>
  )
}
