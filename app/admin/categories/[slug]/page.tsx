import { notFound } from "next/navigation"
import { CategoryActions } from "~/app/admin/categories/_components/category-actions"
import { CategoryForm } from "~/app/admin/categories/_components/category-form"
import { getCategoryBySlug, getTools } from "~/app/admin/categories/_lib/queries"
import { Wrapper } from "~/components/admin/ui/wrapper"
import { H3 } from "~/components/common/heading"

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function UpdateCategoryPage({ params }: PageProps) {
  const { slug } = await params
  const [category, tools] = await Promise.all([getCategoryBySlug(slug), getTools()])

  if (!category) {
    return notFound()
  }

  return (
    <Wrapper size="md">
      <div className="flex items-center justify-between gap-4">
        <H3>Update category</H3>

        <CategoryActions category={category} />
      </div>

      <CategoryForm category={category} tools={tools} />
    </Wrapper>
  )
}
