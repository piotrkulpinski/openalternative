import { notFound } from "next/navigation"
import { CategoryActions } from "~/app/(dashboard)/categories/_components/category-actions"
import { CategoryForm } from "~/app/(dashboard)/categories/_components/category-form"
import { getCategoryById, getTools } from "~/app/(dashboard)/categories/_lib/queries"
import { H3 } from "~/components/ui/heading"
import { Wrapper } from "~/components/ui/wrapper"

export default async function UpdateCategoryPage({ params }: { params: { id: string } }) {
  const [category, tools] = await Promise.all([getCategoryById(params.id), getTools()])

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
