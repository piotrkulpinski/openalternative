import { notFound } from "next/navigation"
import { ToolActions } from "~/app/admin/tools/_components/tool-actions"
import { ToolForm } from "~/app/admin/tools/_components/tool-form"
import { getAlternatives, getCategories, getToolBySlug } from "~/app/admin/tools/_lib/queries"
import { Wrapper } from "~/components/admin/ui/wrapper"
import { H3 } from "~/components/common/heading"
import { requireAuthentication } from "~/utils/auth"

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function UpdateToolPage({ params }: PageProps) {
  await requireAuthentication()

  const { slug } = await params
  const [tool, alternatives, categories] = await Promise.all([
    getToolBySlug(slug),
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
