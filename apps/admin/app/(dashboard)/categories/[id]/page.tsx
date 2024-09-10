import { notFound } from "next/navigation"
import { CategoryForm } from "~/app/(dashboard)/categories/_components/CategoryForm"
import { getCategoryById, getTools } from "~/app/(dashboard)/categories/_lib/queries"
import { H3 } from "~/components/ui/Heading"

export default async function UpdateCategoryPage({ params }: { params: { id: string } }) {
  const [category, tools] = await Promise.all([getCategoryById(params.id), getTools()])

  if (!category) {
    return notFound()
  }

  return (
    <>
      <H3>Update category</H3>

      <CategoryForm category={category} tools={tools} className="mt-4" />
    </>
  )
}
