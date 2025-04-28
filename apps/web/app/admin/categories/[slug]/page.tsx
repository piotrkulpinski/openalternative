import { notFound } from "next/navigation"
import { CategoryForm } from "~/app/admin/categories/_components/category-form"
import { withAdminPage } from "~/components/admin/auth-hoc"
import { Wrapper } from "~/components/admin/wrapper"
import { findCategoryBySlug, findCategoryList } from "~/server/admin/categories/queries"
import { findToolList } from "~/server/admin/tools/queries"

type PageProps = {
  params: Promise<{ slug: string }>
}

const UpdateCategoryPage = async ({ params }: PageProps) => {
  const { slug } = await params
  const category = await findCategoryBySlug(slug)

  if (!category) {
    return notFound()
  }

  return (
    <Wrapper size="md">
      <CategoryForm
        title="Update category"
        category={category}
        toolsPromise={findToolList()}
        categoriesPromise={findCategoryList({ where: { slug: { not: slug } } })}
      />
    </Wrapper>
  )
}

export default withAdminPage(UpdateCategoryPage)
