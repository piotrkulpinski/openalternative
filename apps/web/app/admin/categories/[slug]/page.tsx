import { notFound } from "next/navigation"
import { UpdateCategoryActions } from "~/app/admin/categories/[slug]/actions"
import { CategoryForm } from "~/app/admin/categories/_components/category-form"
import { Wrapper } from "~/components/admin/wrapper"
import { H3 } from "~/components/common/heading"
import { findCategoryBySlug } from "~/server/admin/categories/queries"
import { findToolList } from "~/server/admin/tools/queries"

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function UpdateCategoryPage({ params }: PageProps) {
  const { slug } = await params
  const category = await findCategoryBySlug(slug)

  if (!category) {
    return notFound()
  }

  return (
    <Wrapper size="md">
      <div className="flex items-center justify-between gap-4">
        <H3>Update category</H3>

        <UpdateCategoryActions category={category} />
      </div>

      <CategoryForm category={category} tools={findToolList()} />
    </Wrapper>
  )
}
