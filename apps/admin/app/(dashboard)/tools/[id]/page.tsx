import { notFound } from "next/navigation"
import { ToolActions } from "~/app/(dashboard)/tools/_components/tool-actions"
import { ToolForm } from "~/app/(dashboard)/tools/_components/tool-form"
import { getAlternatives, getCategories, getToolById } from "~/app/(dashboard)/tools/_lib/queries"
import { H3 } from "~/components/ui/heading"
import { Wrapper } from "~/components/ui/wrapper"

export default async function UpdateToolPage({ params }: { params: { id: string } }) {
  const [tool, alternatives, categories] = await Promise.all([
    getToolById(params.id),
    getAlternatives(),
    getCategories(),
  ])

  if (!tool) {
    return notFound()
  }

  return (
    <Wrapper size="md">
      <div className="flex items-center justify-between gap-4">
        <H3>Update tool</H3>

        <ToolActions tool={tool} />
      </div>

      <ToolForm tool={tool} alternatives={alternatives} categories={categories} />
    </Wrapper>
  )
}
