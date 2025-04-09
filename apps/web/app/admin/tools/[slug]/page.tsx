import { notFound } from "next/navigation"
import { UpdateToolActions } from "~/app/admin/tools/[slug]/actions"
import { ToolForm } from "~/app/admin/tools/_components/tool-form"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { Wrapper } from "~/components/admin/wrapper"
import { H3 } from "~/components/common/heading"
import { findAlternativeList } from "~/server/admin/alternatives/queries"
import { findCategoryList } from "~/server/admin/categories/queries"
import { findToolBySlug } from "~/server/admin/tools/queries"

type PageProps = {
  params: Promise<{ slug: string }>
}

const UpdateToolPage = async ({ params }: PageProps) => {
  const { slug } = await params
  const tool = await findToolBySlug(slug)

  if (!tool) {
    return notFound()
  }

  return (
    <Wrapper size="md">
      <div className="flex items-center justify-between gap-4">
        <H3>Update tool</H3>

        <UpdateToolActions tool={tool} />
      </div>

      <ToolForm tool={tool} alternatives={findAlternativeList()} categories={findCategoryList()} />
    </Wrapper>
  )
}

export default withAdminPage(UpdateToolPage)
