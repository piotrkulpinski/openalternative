import { notFound } from "next/navigation"
import { ToolActions } from "~/app/admin/tools/_components/tool-actions"
import { ToolForm } from "~/app/admin/tools/_components/tool-form"
import { Wrapper } from "~/components/admin/ui/wrapper"
import { H3 } from "~/components/common/heading"
import { findAlternativeList } from "~/server/admin/alternatives/queries"
import { findCategoryList } from "~/server/admin/categories/queries"
import { findToolBySlug } from "~/server/admin/tools/queries"

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function UpdateToolPage({ params }: PageProps) {
  const { slug } = await params
  const tool = await findToolBySlug(slug)

  if (!tool) {
    return notFound()
  }

  return (
    <Wrapper size="md">
      <div className="flex items-center justify-between gap-4">
        <H3>Update tool</H3>

        <ToolActions tool={tool} />
      </div>

      <ToolForm tool={tool} alternatives={findAlternativeList()} categories={findCategoryList()} />
    </Wrapper>
  )
}
